import { useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import useClickOutside from "../../../../hooks/useClickOutside";
import useKeyEscClose from "../../../../hooks/useKeyEscClose";
import Close from "@/lib/assets/svgs/close.svg";

type DetailImageModalProps = {
  image: string;
  isOpen: boolean;
  onClose: () => void;
};

const Container = styled.div<{ open: boolean }>`
  display: ${(props) => !props.open && "none"};
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.9);
`;

const Inner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Img = styled.img`
  margin: auto;
  width: 100%;
  max-width: 1024px;
  max-height: 1024px;
  object-fit: contain;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 24px;
  right: 24px;

  width: 28px;
  height: 28px;

  cursor: pointer;

  filter: invert(1);
`;

const DetailImageModal = ({
  image,
  isOpen,
  onClose,
}: DetailImageModalProps) => {
  const modalRef = useRef<HTMLImageElement>(null);
  useClickOutside(modalRef, onClose);
  useKeyEscClose(onClose);

  return createPortal(
    <Container id={`detail-image-${image}`} open={isOpen}>
      <CloseButton onClick={onClose} src={Close} />
      <Inner>
        <Img src={image} ref={modalRef} />
      </Inner>
    </Container>,
    document.body
  );
};

export default DetailImageModal;
