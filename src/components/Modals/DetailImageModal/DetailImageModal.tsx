import { createPortal } from "react-dom";
import styled from "styled-components";
import { ReactComponent as Close } from "../../../assets/svgs/close.svg";
import useBodyScrollLock from "../../../Hooks/useBodyScrollLock";
import { useEffect, useRef } from "react";
import useClickOutside from "../../../Hooks/useClickOutside";

type DetailImageModalProps = {
  image: string;
  isOpen: boolean;
  onClose: () => void;
};

const Container = styled.div<{ open: boolean }>`
  ${(props) => !props.open && `display:none`}
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

const CloseButton = styled(Close)`
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
  const { lockScroll, openScroll } = useBodyScrollLock();
  useClickOutside(modalRef, onClose);

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      openScroll();
    }
    return () => {
      openScroll();
    };
  }, [isOpen, lockScroll, openScroll]);

  return createPortal(
    <Container id={`detail-image-${image}`} open={isOpen}>
      <CloseButton
        onClick={() => {
          openScroll();
          onClose();
        }}
      />
      <Inner>
        <Img src={image} ref={modalRef} />
      </Inner>
    </Container>,
    document.body
  );
};

export default DetailImageModal;
