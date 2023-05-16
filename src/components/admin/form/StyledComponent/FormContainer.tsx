import styled from "styled-components";

export const StyledLabel = styled.label`
  font-size: ${(props) => props.theme.defaultFontSize};
`;

export const FormContainer = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  padding: 2rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const CancelButton = styled.button`
  margin-top: 10px;
  cursor: pointer;
  font-size: ${(props) => props.theme.defaultFontSize};
  background: ${(props) => props.theme.accentColor};
  border: 1px solid ${(props) => props.theme.accentColor};
  color: #fff;
  padding: 10px 20px;
  margin-right: 1rem;

  &:hover {
    opacity: 0.6;
  }
`;
export const StyledInput = styled.input`
  &[type="text"],
  &[type="password"] {
    height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &[type="submit"] {
    margin-top: 10px;
    cursor: pointer;
    font-size: ${(props) => props.theme.defaultFontSize};
    background: ${(props) => props.theme.primaryColor};
    border: 1px solid ${(props) => props.theme.primaryColor};
    color: #fff;
    padding: 10px 20px;
  }

  &[type="submit"]:hover {
    opacity: 0.6;
  }

  &[type="date"] {
  }

  &[type="file"] {
  }
`;

export const StyledTextArea = styled.textarea`
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  resize: none;
`;

export const TagsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
`;

export const TagAddButton = styled.button``;

export const TagDeleteButton = styled.button``;

export const PreviewContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  grid-template-columns: repeat(5, 1fr);
`;
export const PreviewImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const PreviewImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

export const PreviewName = styled.span`
  font-size: ${(props) => props.theme.defaultFontSize};
`;

export const NewArticleButton = styled.button`
  margin-top: 10px;
  cursor: pointer;
  font-size: ${(props) => props.theme.defaultFontSize};
  background: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
  color: #fff;
  padding: 10px 20px;
  &:hover {
    opacity: 0.6;
  }
`;
