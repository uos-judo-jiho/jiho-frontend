import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Props {
  /** 시작 지점(뷰포트 좌표) — 더블탭한 위치. */
  from: { x: number; y: number };
  /** 도착 지점(뷰포트 좌표) — 좋아요 버튼 중심. */
  to: { x: number; y: number };
  onDone: () => void;
}

/**
 * 인스타/틱톡식 좋아요 하트 — 더블탭한 지점에서 팝(pop)했다가 좋아요 버튼으로
 * 작아지며 날아가 채워지는 느낌. fixed 좌표라 세로 피드 transform 밖(포탈)에서 렌더한다.
 */
export const FlyingHeart = ({ from, to, onDone }: Props) => (
  <motion.div
    className="pointer-events-none fixed left-0 top-0 z-40"
    initial={{ x: from.x, y: from.y, scale: 0, opacity: 0 }}
    animate={{
      x: [from.x, from.x, to.x],
      y: [from.y, from.y, to.y],
      scale: [0, 1.3, 0.3],
      opacity: [0, 1, 0.9],
    }}
    transition={{ duration: 0.72, times: [0, 0.3, 1], ease: [0.4, 0, 0.2, 1] }}
    onAnimationComplete={onDone}
  >
    {/* -ml/-mt로 하트 중심을 좌표에 정렬(h-10=40px의 절반=20px). */}
    <Heart
      className="-ml-5 -mt-5 h-10 w-10 fill-red-500 text-red-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
      strokeWidth={1}
    />
  </motion.div>
);
