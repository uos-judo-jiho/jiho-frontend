import styled from "styled-components";

export const FormContainer = styled.div`
  background-color: white;
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

export const StyledInput = styled.input`
  &[type="text"],
  &[type="password"] {
    height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &[type="submit"] {
    margin-top: 10px;
    cursor: pointer;
    font-size: 15px;
    background: #01d28e;
    border: 1px solid #01d28e;
    color: #fff;
    padding: 10px 20px;
  }

  &[type="submit"]:hover {
    background: #6cf0c2;
  }

  &[type="date"] {
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
