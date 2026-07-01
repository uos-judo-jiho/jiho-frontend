import {
  detectPlatform,
  isStandalone,
  type InstallPlatform,
} from "@/shared/lib/platform";
import {
  consumeInstallPrompt,
  useBeforeInstallPrompt,
} from "@/shared/lib/use-pwa-install";
import {
  Copy,
  Download,
  ExternalLink,
  Menu,
  MoreVertical,
  Plus,
  Share,
  SquarePlus,
  X,
} from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import { toast } from "sonner";

const DISMISS_KEY = "shorts-install-dismissed";

interface Step {
  Icon: ComponentType<{ className?: string }>;
  text: ReactNode;
}

interface Guide {
  title: string;
  steps: Step[];
  /** 인앱 브라우저: 링크 복사 버튼을 함께 노출. */
  showCopy?: boolean;
}

/** 플랫폼별 홈 화면 추가(설치) 안내. */
const GUIDES: Record<InstallPlatform, Guide> = {
  "ios-safari": {
    title: "홈 화면에 추가",
    steps: [
      { Icon: Share, text: "Safari 하단의 공유 버튼을 누르세요." },
      { Icon: SquarePlus, text: "‘홈 화면에 추가’를 선택하세요." },
      { Icon: Download, text: "오른쪽 위 ‘추가’를 누르면 끝!" },
    ],
  },
  "ios-other": {
    title: "Safari로 열어주세요",
    steps: [
      {
        Icon: ExternalLink,
        text: "iOS에서는 Safari에서만 앱 설치가 가능해요.",
      },
      {
        Icon: Share,
        text: "Safari로 이 페이지를 연 뒤 공유 → ‘홈 화면에 추가’를 누르세요.",
      },
    ],
    showCopy: true,
  },
  "android-chrome": {
    title: "홈 화면에 추가",
    steps: [
      { Icon: MoreVertical, text: "오른쪽 위 메뉴(⋮)를 누르세요." },
      { Icon: Download, text: "‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택하세요." },
      { Icon: Plus, text: "‘설치’를 누르면 끝!" },
    ],
  },
  samsung: {
    title: "홈 화면에 추가",
    steps: [
      { Icon: Menu, text: "하단 메뉴 버튼을 누르세요." },
      { Icon: Plus, text: "‘현재 페이지 추가’를 누르세요." },
      { Icon: Download, text: "‘홈 화면’을 선택하면 끝!" },
    ],
  },
  inapp: {
    title: "브라우저로 열어주세요",
    steps: [
      {
        Icon: ExternalLink,
        text: "네이버·카카오 등 인앱 브라우저에서는 앱 설치가 안 돼요.",
      },
      {
        Icon: MoreVertical,
        text: "우측 상단(또는 하단) 메뉴에서 ‘다른 브라우저로 열기’를 선택하세요.",
      },
      {
        Icon: Copy,
        text: "또는 링크를 복사해 Chrome·Safari에 붙여넣어 여세요.",
      },
    ],
    showCopy: true,
  },
  desktop: {
    title: "앱 설치",
    steps: [
      { Icon: Download, text: "주소창 오른쪽의 설치 아이콘을 누르세요." },
      {
        Icon: MoreVertical,
        text: "또는 브라우저 메뉴에서 ‘앱 설치’를 선택하세요.",
      },
    ],
  },
  unknown: {
    title: "홈 화면에 추가",
    steps: [
      {
        Icon: Download,
        text: "브라우저 메뉴에서 ‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택하세요.",
      },
    ],
  },
};

/**
 * PWA 설치 유도 바텀 시트.
 * - Chrome/Edge/삼성 인터넷: beforeinstallprompt로 네이티브 설치 시트를 바로 띄운다.
 * - iOS·삼성(미지원 시)·인앱 브라우저: 플랫폼별 수동 안내를 노출한다.
 * standalone(이미 설치)이거나 사용자가 닫았으면 표시하지 않는다.
 */
export const InstallPrompt = () => {
  const bip = useBeforeInstallPrompt();
  const [hidden, setHidden] = useState(
    () =>
      isStandalone() ||
      (typeof window !== "undefined" &&
        localStorage.getItem(DISMISS_KEY) === "1"),
  );

  if (hidden) return null;

  const dismiss = () => {
    if (typeof window !== "undefined") localStorage.setItem(DISMISS_KEY, "1");
    setHidden(true);
  };

  const install = async () => {
    if (!bip) return;
    await bip.prompt();
    await bip.userChoice; // 수락/거절 모두 시트를 닫는다(설치 완료는 appinstalled로 감지).
    consumeInstallPrompt(); // prompt()는 1회용 — 저장된 이벤트를 비운다.
    dismiss();
  };

  const copyLink = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("링크를 복사했어요"))
      .catch(() => toast.error("링크 복사에 실패했어요"));
  };

  const guide = GUIDES[detectPlatform()];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* 배경 딤 — 탭하면 닫힘 */}
      <button
        type="button"
        aria-label="닫기"
        onClick={dismiss}
        className="absolute inset-0 bg-black/60 animate-in fade-in"
      />

      <div className="relative w-full max-w-md animate-in slide-in-from-bottom-8 duration-300">
        <div className="rounded-t-3xl border-t border-white/10 bg-neutral-900 px-6 pt-6 pb-[calc(var(--safe-bottom)+1.25rem)] text-white shadow-2xl">
          {/* 닫기 */}
          <button
            type="button"
            aria-label="닫기"
            onClick={dismiss}
            className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-white/10 hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 헤더 */}
          <div className="flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt="지호 쇼츠"
              className="h-12 w-12 rounded-xl"
            />
            <div>
              <p className="text-base font-bold leading-tight">
                지호 쇼츠 앱 설치
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">
                홈 화면에 추가하면 전체화면으로 더 편하게 라벨링할 수 있어요.
              </p>
            </div>
          </div>

          {bip ? (
            // 네이티브 설치 지원 — 버튼 한 번으로 설치.
            <button
              type="button"
              onClick={install}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-bold text-black transition-transform active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />앱 설치하기
            </button>
          ) : (
            // 수동 안내 — 플랫폼별 단계.
            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {guide.title}
              </p>
              <ol className="flex flex-col gap-3">
                {guide.steps.map(({ Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <Icon className="mt-1 h-4 w-4 shrink-0 text-indigo-400" />
                    <span className="text-sm leading-relaxed text-neutral-200">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>

              {guide.showCopy && (
                <button
                  type="button"
                  onClick={copyLink}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <Copy className="h-4 w-4" />링크 복사
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full py-2 text-center text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-300"
          >
            나중에 할게요
          </button>
        </div>
      </div>
    </div>
  );
};
