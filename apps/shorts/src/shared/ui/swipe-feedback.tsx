import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Swords, ThumbsUp, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type FeedbackType = "success" | "attempt" | "none" | "like" | null;

interface DragOverlayProps {
  /** 현재 드래그 거리(px). 오른쪽 +, 왼쪽 -. */
  dragX: number;
  /** 스와이프가 확정되는 임계값(px). */
  threshold: number;
  /** 이미 라벨링된 클립이면 방향과 무관하게 "다음"으로 표시. */
  labeled: boolean;
}

/**
 * 손가락을 따라 실시간으로 나타나는 무효/득점 스탬프 (네이티브 스와이프 느낌).
 * 드래그 거리에 비례해 진해지고, 임계값을 넘으면 꽉 찬 상태로 보인다.
 */
export const SwipeDragOverlay = ({
  dragX,
  threshold,
  labeled,
}: DragOverlayProps) => {
  const intensity = Math.min(Math.abs(dragX) / threshold, 1);
  if (intensity <= 0.02) return null;

  const committed = intensity >= 1;
  const direction: "left" | "right" = dragX > 0 ? "right" : "left";

  // 라벨링 완료 클립은 좌우 모두 "다음"으로 안내.
  const stamp = labeled
    ? {
        Icon: ArrowRight,
        label: "다음",
        border: "border-white",
        text: "text-white",
        bg: "bg-white/10",
      }
    : direction === "right"
      ? {
          Icon: Swords,
          label: "기술시도",
          border: "border-amber-400",
          text: "text-amber-300",
          bg: "bg-amber-500/15",
        }
      : {
          Icon: ThumbsUp,
          label: "기술성공",
          border: "border-green-400",
          text: "text-green-300",
          bg: "bg-green-500/15",
        };

  const { Icon } = stamp;
  // 영상이 비켜난 반대편(빈 공간)에 스탬프를 고정 — 왼쪽으로 밀면 오른쪽에 표시.
  const side = labeled
    ? "left-1/2 -translate-x-1/2"
    : direction === "right"
      ? "left-6"
      : "right-6";

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div
        className={cn("absolute top-1/2 -translate-y-1/2", side)}
        style={{
          opacity: 0.25 + intensity * 0.75,
          transform: `scale(${0.8 + intensity * 0.2})`,
        }}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border-2 px-6 py-4 backdrop-blur-sm transition-colors",
            stamp.border,
            stamp.text,
            committed ? stamp.bg : "bg-black/20",
          )}
        >
          <Icon className="h-10 w-10" strokeWidth={2} />
          <span className="text-lg font-extrabold tracking-wide">
            {stamp.label}
          </span>
        </div>
      </div>
    </div>
  );
};

interface Props {
  feedback: FeedbackType;
  onDone: () => void;
}

const CONFIG = {
  success: {
    icon: ThumbsUp,
    label: "기술성공!",
    bg: "bg-green-500/20",
    border: "border-green-400",
    text: "text-green-300",
  },
  attempt: {
    icon: Swords,
    label: "기술시도",
    bg: "bg-amber-500/20",
    border: "border-amber-400",
    text: "text-amber-300",
  },
  none: {
    icon: XCircleIcon,
    label: "기술없음",
    bg: "bg-red-500/20",
    border: "border-red-400",
    text: "text-red-300",
  },
} as const;

/**
 * 인스타식 좋아요 하트 — 가운데에서 팝인(살짝 오버슈트)했다가 잠깐 머문 뒤
 * 커지며 페이드아웃. 애니메이션이 끝나면 onDone으로 스스로 정리한다.
 */
const InstagramHeart = ({ onDone }: { onDone: () => void }) => (
  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.15, 1, 1, 1.1],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{ duration: 0.85, times: [0, 0.25, 0.4, 0.7, 1], ease: "easeOut" }}
      onAnimationComplete={onDone}
    >
      <Heart
        className="h-28 w-28 fill-white text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
        strokeWidth={1}
      />
    </motion.div>
  </div>
);

export const SwipeFeedback = ({ feedback, onDone }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 좋아요는 framer onAnimationComplete가 정리하므로 타이머를 걸지 않는다.
    if (!feedback || feedback === "like") return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 150);
    }, 600);
    return () => clearTimeout(t);
  }, [feedback, onDone]);

  if (!feedback) return null;

  if (feedback === "like") return <InstagramHeart onDone={onDone} />;

  const cfg = CONFIG[feedback];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-3xl border-2 px-10 py-8 backdrop-blur-sm",
          cfg.bg,
          cfg.border,
        )}
      >
        <Icon className={cn("h-16 w-16", cfg.text)} strokeWidth={1.5} />
        <span className={cn("text-2xl font-bold", cfg.text)}>{cfg.label}</span>
      </div>
    </div>
  );
};
