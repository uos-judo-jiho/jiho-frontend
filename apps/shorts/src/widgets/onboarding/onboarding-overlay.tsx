import { useState } from "react";
import type { CSSProperties } from "react";

const STORAGE_KEY = "shorts-onboarded-v2";

const KEYFRAMES = `
  @keyframes ob-swipe-right {
    from { transform: translateX(-52px) scale(0.75); opacity: 0; }
    to   { transform: translateX(0)     scale(1);    opacity: 1; }
  }
  @keyframes ob-swipe-left {
    from { transform: translateX(52px) scale(0.75); opacity: 0; }
    to   { transform: translateX(0)    scale(1);    opacity: 1; }
  }
  @keyframes ob-double-tap {
    0%   { transform: scale(1); }
    20%  { transform: scale(0.8); }
    45%  { transform: scale(1.12); }
    65%  { transform: scale(0.8); }
    85%  { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
  @keyframes ob-tap {
    0%   { transform: scale(1); }
    35%  { transform: scale(0.78); }
    70%  { transform: scale(1.06); }
    100% { transform: scale(1); }
  }
  @keyframes ob-fade-scale {
    from { transform: scale(0.88); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }
  @keyframes ob-slide-up {
    from { transform: translateY(14px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
`;

interface Step {
  emoji: string;
  accentColor: string;
  emojiAnim: CSSProperties;
  label: string;
  title: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    emoji: "🥋",
    accentColor: "text-white",
    emojiAnim: { animation: "ob-fade-scale 0.5s cubic-bezier(0.16,1,0.3,1) both" },
    label: "시작하기 전에",
    title: "지호 쇼츠",
    detail: "스와이프 제스처로 하이라이트 클립을 빠르게 분류할 수 있어요. 다음 단계에서 제스처를 알아볼게요.",
  },
  {
    emoji: "👈",
    accentColor: "text-green-400",
    emojiAnim: { animation: "ob-swipe-left 0.5s cubic-bezier(0.16,1,0.3,1) both" },
    label: "왼쪽 스와이프",
    title: "기술성공",
    detail: "기술이 성공해 득점이 인정되는 장면일 때 왼쪽으로 스와이프하세요.",
  },
  {
    emoji: "👉",
    accentColor: "text-amber-400",
    emojiAnim: { animation: "ob-swipe-right 0.5s cubic-bezier(0.16,1,0.3,1) both" },
    label: "오른쪽 스와이프",
    title: "기술시도",
    detail: "득점 없이 기술 시도만 있는 장면일 때 오른쪽으로 스와이프하세요.",
  },
  {
    emoji: "✌️",
    accentColor: "text-pink-400",
    emojiAnim: { animation: "ob-double-tap 0.85s ease-in-out both" },
    label: "두 번 탭",
    title: "좋아요",
    detail: "인상적인 장면이 있다면 화면을 빠르게 두 번 탭해 좋아요를 남길 수 있어요.",
  },
  {
    emoji: "☝️",
    accentColor: "text-indigo-400",
    emojiAnim: { animation: "ob-tap 0.75s ease-in-out both" },
    label: "한 번 탭",
    title: "일시정지 / 재생",
    detail: "화면을 한 번 탭하면 영상을 멈추거나 다시 재생할 수 있어요.",
  },
];

interface Props {
  onDone: () => void;
}

export const OnboardingOverlay = ({ onDone }: Props) => {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const next = () => {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/95 pl-[var(--safe-left)] pr-[var(--safe-right)] backdrop-blur-sm">
      <style>{KEYFRAMES}</style>

      {/* skip */}
      <button
        type="button"
        onClick={onDone}
        className="absolute right-[calc(var(--safe-right)+1rem)] top-[calc(var(--safe-top)+0.75rem)] z-10 rounded-full px-3 py-1 text-xs text-neutral-600 transition-colors hover:text-neutral-300"
      >
        건너뛰기
      </button>

      {/* left: emoji zone */}
      <div className="flex w-[42%] items-center justify-center border-r border-white/5">
        <span
          key={step}
          className="select-none"
          style={{ fontSize: "5rem", lineHeight: 1, ...current.emojiAnim }}
        >
          {current.emoji}
        </span>
      </div>

      {/* right: content */}
      <div className="flex w-[58%] flex-col justify-center gap-3 px-7 py-6">
        {/* text block — key triggers slide-up on step change */}
        <div
          key={step}
          style={{ animation: "ob-slide-up 0.38s ease-out both" }}
          className="flex flex-col gap-1"
        >
          <p className={`text-[10px] font-semibold uppercase tracking-widest ${current.accentColor}`}>
            {step === 0 ? "시작하기 전에" : `${step} / ${STEPS.length - 1}`}
          </p>
          <p className="text-xl font-bold leading-tight text-white">
            {current.title}
          </p>
          <p className="text-xs leading-relaxed text-neutral-400">
            {current.detail}
          </p>
        </div>

        {/* dots + button */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}단계로 이동`}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === step
                    ? "h-1.5 w-5 bg-white"
                    : "h-1.5 w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className={`ml-auto rounded-xl px-5 py-2 text-sm font-bold transition-all active:scale-95 ${
              isLast
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isLast ? "시작하기" : "다음 →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const useOnboarding = () => {
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1",
  );

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDone(true);
  };

  return { needsOnboarding: !done, complete };
};
