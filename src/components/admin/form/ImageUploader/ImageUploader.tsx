import React, { useEffect, useState } from "react";
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
import { getImageFileFromSrc } from "../../../../utils/Utils";

type ImageUploaderProps = {
  setValues: React.Dispatch<React.SetStateAction<ValuesType>>;
  data?: string[];
};

function ImageUploader({ setValues, data }: ImageUploaderProps) {
  const [img, setImg] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<string[]>(data || []);
  const [isFull, setIsFull] = useState<boolean>(false);

  useEffect(() => {
    async function _convertFileFromSrc() {
      let defaultFiles: File[] = [];
      previewImg.map(async (previewImgsrc) => {
        const imgSrc = previewImgsrc;
        const file = await getImageFileFromSrc(imgSrc);
        if (file) {
          defaultFiles.push(file);
        }
      });
      if (defaultFiles) {
        setImg(defaultFiles);
      }
    }
    _convertFileFromSrc();
  }, [data]);

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

    setValues((prev) => {
      return { ...prev, images: [...imgArr] };
    });
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
      />
      <PreviewContainer>
        {previewImg.map((el, index) => {
          return (
            <PreviewImgContainer key={"upload-img" + index}>
              <PreviewImg src={previewImg[index]} />
              <TagDeleteButton onClick={(event) => deleteImg(event, index)}>
                <PreviewName>❌</PreviewName>
              </TagDeleteButton>
            </PreviewImgContainer>
          );
        })}
      </PreviewContainer>
    </InputContainer>
  );
}

export default ImageUploader;
