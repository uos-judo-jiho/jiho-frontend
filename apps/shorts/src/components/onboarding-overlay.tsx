import { useState } from "react";

const STORAGE_KEY = "shorts-onboarded-v1";

const GESTURES = [
  { emoji: "👉", label: "스와이프 오른쪽", desc: "득점 (기술 성공)" },
  { emoji: "👈", label: "스와이프 왼쪽", desc: "무효 (득점 없음)" },
  { emoji: "✌️", label: "두 번 탭", desc: "좋아요 토글" },
  { emoji: "☝️", label: "한 번 탭", desc: "영상 일시정지 / 재생" },
] as const;

interface Props {
  onDone: () => void;
}

export const OnboardingOverlay = ({ onDone }: Props) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90 px-8 backdrop-blur-sm">
    <div className="text-center">
      <p className="text-2xl font-bold text-white">🥋 제스처 가이드</p>
      <p className="mt-1 text-sm text-neutral-400">스와이프로 빠르게 라벨링하세요</p>
    </div>

    <div className="w-full max-w-sm space-y-3">
      {GESTURES.map((g) => (
        <div key={g.label} className="flex items-center gap-4 rounded-xl bg-white/5 px-5 py-3.5">
          <span className="text-3xl">{g.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-white">{g.label}</p>
            <p className="text-xs text-neutral-400">{g.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={onDone}
      className="mt-2 rounded-2xl bg-white px-12 py-3.5 text-base font-bold text-black transition-opacity hover:opacity-90 active:opacity-75"
    >
      시작하기
    </button>
  </div>
);

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
