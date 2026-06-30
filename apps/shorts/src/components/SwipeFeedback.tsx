import { cn } from "@/lib/utils";
import { Heart, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

export type FeedbackType = "success" | "none" | "like" | null;

interface Props {
  feedback: FeedbackType;
  onDone: () => void;
}

const CONFIG = {
  success: {
    icon: ThumbsUp,
    label: "득점!",
    bg: "bg-green-500/20",
    border: "border-green-400",
    text: "text-green-300",
  },
  none: {
    icon: ThumbsDown,
    label: "무효",
    bg: "bg-red-500/20",
    border: "border-red-400",
    text: "text-red-300",
  },
  like: {
    icon: Heart,
    label: "좋아요!",
    bg: "bg-pink-500/20",
    border: "border-pink-400",
    text: "text-pink-300",
  },
} as const;

export const SwipeFeedback = ({ feedback, onDone }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!feedback) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 150);
    }, 600);
    return () => clearTimeout(t);
  }, [feedback, onDone]);

  if (!feedback) return null;

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
