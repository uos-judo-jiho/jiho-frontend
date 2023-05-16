import React, { useState } from "react";
import {
  InputContainer,
  PreviewContainer,
  PreviewImg,
  PreviewImgContainer,
  PreviewName,
  StyledInput,
  StyledLabel,
  TagDeleteButton,
} from "../StyledComponent/FormContainer";
import { ValuesType } from "../Type/ArticleType";

type ImageUploaderProps = {
  setValues: React.Dispatch<React.SetStateAction<ValuesType>>;
};

function ImageUploader({ setValues }: ImageUploaderProps) {
  const [img, setImg] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<string[]>([]);
  const [isFull, setIsFull] = useState<boolean>(false);

  function insertImg(event: React.ChangeEvent<HTMLInputElement>) {
    let reader = new FileReader();

    if (event.target.files && event.target.files[0]) {
      if (img.length > 10) {
        setIsFull(true);
        return;
      }
      reader.readAsDataURL(event.target.files[0]);
      const newImgs = [...img, event.target.files[0]];

      setImg(newImgs);

      setValues((prev) => {
        return { ...prev, images: newImgs };
      });
    }

    reader.onloadend = () => {
      const previewImgUrl = reader.result as string;

      if (previewImgUrl) {
        setPreviewImg([...previewImg, previewImgUrl]);
      }
    };
  }

  function deleteImg(
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    const imgArr = img.filter((el, idx) => idx !== index);
    const imgNameArr = previewImg.filter((el, idx) => idx !== index);

    setImg([...imgArr]);
    setPreviewImg([...imgNameArr]);
  }

  return (
    <InputContainer>
      <StyledLabel htmlFor="file" aria-required="true">
        사진 올리기 (최대 10장)
      </StyledLabel>
      <StyledInput
        id="file"
        accept="image/*"
        type="file"
        name="file"
        onChange={insertImg}
        required
      />
      <PreviewContainer>
        {img.map((el, index) => {
          const { name } = el;

          return (
            <PreviewImgContainer key={"upload-img" + index}>
              <PreviewImg src={previewImg[index]} />
              <TagDeleteButton onClick={(event) => deleteImg(event, index)}>
                <PreviewName>{name} ❌</PreviewName>
              </TagDeleteButton>
            </PreviewImgContainer>
          );
        })}
      </PreviewContainer>
    </InputContainer>
  );
}

export default ImageUploader;
