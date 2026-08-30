import { CloseIcon } from "@/shared/ui/icons";
import { Overlay } from "@/shared/ui/overlay";

type LightboxProps = {
  src: string | null;
  alt?: string;
  onClose: () => void;
};

/** 사진 한 장을 전체 화면으로 띄운다. */
export const Lightbox = ({ src, alt, onClose }: LightboxProps) => (
  <Overlay
    open={src !== null}
    onClose={onClose}
    label={alt ?? "사진 크게 보기"}
    panelClassName="flex h-full w-full items-center justify-center p-4 sm:p-10"
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="닫기"
      className="absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full text-on-inverse transition-colors hover:bg-inverse-surface sm:top-4 sm:right-4"
    >
      <CloseIcon className="size-6" decorative />
    </button>
    {src ? (
      <img
        src={src}
        alt={alt ?? "상세 이미지"}
        className="max-h-full max-w-full object-contain"
      />
    ) : null}
  </Overlay>
);
