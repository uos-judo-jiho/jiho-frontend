import { RotateCcw } from "lucide-react";

export const RotatePrompt = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black text-white">
    <RotateCcw className="h-14 w-14 animate-spin text-neutral-400 [animation-duration:3s]" />
    <div className="text-center">
      <p className="text-lg font-semibold">기기를 가로로 돌려주세요</p>
      <p className="mt-1 text-sm text-neutral-500">가로 영상 라벨링에 최적화된 앱이에요</p>
    </div>
  </div>
);
