import React from "react";
import Col from "@/components/layouts/Col";
import Row from "@/components/layouts/Row";
import { cn } from "@/lib/utils";

type SubmitModalProps = {
  confirmText: string;
  cancelText: string;
  description: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
};

function SubmitModal({
  confirmText,
  cancelText,
  description,
  open,
  setOpen,
  onSubmit,
}: SubmitModalProps) {
  const handleCancel = () => setOpen(false);

  const handleConfirm = () => onSubmit();

  if (!open) return <></>;

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-[1] flex justify-center items-center">
      <div className="w-1/2 h-[20vw] text-center py-5 px-[10px] bg-theme-bg shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]">
        <Col full>
          <span className="text-base h-full">{description}</span>
          <div>
            <Row justifyContent="center">
              <button
                onClick={handleCancel}
                className={cn(
                  "mt-[10px] cursor-pointer text-base border px-5 py-[10px] mr-[10px]",
                  "bg-theme-accent border-theme-accent text-white",
                  "hover:opacity-60",
                )}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  "mt-[10px] cursor-pointer text-base border px-5 py-[10px] mr-[10px]",
                  "bg-theme-primary border-theme-primary text-white",
                  "hover:opacity-60",
                )}
              >
                {confirmText}
              </button>
            </Row>
          </div>
        </Col>
      </div>
    </div>
  );
}

export default SubmitModal;
