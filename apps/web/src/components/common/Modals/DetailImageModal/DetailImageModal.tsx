import { CloseIcon } from "@/components/icons";
import useClickOutside from "@/shared/hooks/useClickOutside";
import useKeyEscClose from "@/shared/hooks/useKeyEscClose";
import { cn } from "@/shared/lib/utils";
import { useRef } from "react";
import { createPortal } from "react-dom";

type DetailImageModalProps = {
  image: string;
  isOpen: boolean;
  title?: string;
  onClose: () => void;
};

const DetailImageModal = ({
  image,
  isOpen,
  title,
  onClose,
}: DetailImageModalProps) => {
  const modalRef = useRef<HTMLImageElement>(null);
  useClickOutside(modalRef, onClose);
  useKeyEscClose(onClose);

  return createPortal(
    <div
      id={`detail-image-${image}`}
      className={cn(
        "fixed w-screen h-screen top-0 right-0 bottom-0 left-0 z-[10] bg-black/90",
        !isOpen && "hidden",
      )}
    >
      <CloseIcon
        onClick={onClose}
        title="Close image modal"
        className="absolute top-6 right-6 w-7 h-7 cursor-pointer invert"
      />
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={image}
          ref={modalRef}
          alt={title || "상세 이미지"}
          className="m-auto w-full max-w-[1024px] max-h-[1024px] object-contain"
        />
      </div>
    </div>,
    document.body,
  );
};

export default DetailImageModal;
