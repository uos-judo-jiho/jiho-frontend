import React from "react";
import styled, { css } from "styled-components";
import Col from "../../../layouts/Col";
import Row from "../../../layouts/Row";

type SubmitModalProps = {
  confirmText: string;
  cancelText: string;
  description: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
};
const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 50%;
  height: 20vw;
  text-align: center;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.bgColor};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const StyledButton = css`
  margin-top: 10px;
  cursor: pointer;
  font-size: ${(props) => props.theme.defaultFontSize};
  background: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
  color: #fff;
  padding: 10px 20px;
  margin-right: 10px;

  &:hover {
    opacity: 0.6;
  }
`;
const ConfirmButton = styled.button`
  ${StyledButton}
  background: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
`;
const CancelButton = styled.button`
  ${StyledButton}
  background: ${(props) => props.theme.accentColor};
  border: 1px solid ${(props) => props.theme.accentColor};
`;
const Description = styled.span`
  font-size: ${(props) => props.theme.defaultFontSize};

  height: 100%;
`;

function SubmitModal({ confirmText, cancelText, description, open, setOpen, onSubmit }: SubmitModalProps) {
  const handleCancel = () => setOpen(false);

  const handleConfirm = () => onSubmit();

  if (!open) return <></>;

  return (
    <Container>
      <ModalContainer>
        <Col full>
          <Description>{description}</Description>
          <div>
            <Row justifyContent="center">
              <CancelButton onClick={handleCancel}>{cancelText}</CancelButton>
              <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
            </Row>
          </div>
        </Col>
      </ModalContainer>
    </Container>
  );
}

export default SubmitModal;
