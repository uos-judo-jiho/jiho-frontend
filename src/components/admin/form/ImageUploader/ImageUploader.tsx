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
import { ArticleType } from "../Type/ArticleType";
import { getImageFileFromSrc } from "../../../../utils/Utils";

type ImageUploaderProps = {
  setValues: React.Dispatch<React.SetStateAction<ArticleType>>;
  data?: string[];
  imageLimit?: number;
};

function ImageUploader({
  setValues,
  data,
  imageLimit = 10,
}: ImageUploaderProps) {
  const [img, setImg] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<string[]>(data || []);
  const [isFull, setIsFull] = useState<boolean>(false);

  useEffect(() => {
    async function _convertFileFromSrc() {
      let defaultFiles: File[] = [];
      [...previewImg].map(async (previewImgsrc, index) => {
        const imgSrc = previewImgsrc;
        const file = await getImageFileFromSrc(imgSrc, index.toString());
        if (file) {
          defaultFiles.push(file);
        }
      });
      if (defaultFiles) {
        setImg(defaultFiles);
      }
    }
    _convertFileFromSrc();
  }, [data, previewImg]);

  function insertImg(event: React.ChangeEvent<HTMLInputElement>) {
    if (isFull) {
      alert(`사진은 최대 ${imageLimit}장까지 추가할 수 있습니다.`);
      return;
    } else if (img.length > imageLimit) {
      setIsFull(true);
      return;
    }

    let urlList = [...previewImg];

    if (event.target.files) {
      const files = Array.from(event.target.files);

      for (let i = 0; i < files.length; i++) {
        const currentImageUrl = URL.createObjectURL(files[i]);
        urlList.push(currentImageUrl);
      }

      if (urlList.length > imageLimit) {
        urlList = urlList.slice(0, imageLimit);
      }
      setPreviewImg(urlList);

      let newImgs = [...img, ...files];

      if (newImgs.length > imageLimit) {
        newImgs = newImgs.slice(0, imageLimit);
      }

      setImg(newImgs);

      setValues((prev) => {
        return { ...prev, images: newImgs };
      });
    }
  }

  function deleteImg(
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    event.preventDefault();
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
        사진 올리기 (최대 {imageLimit}장)
      </StyledLabel>
      <StyledInput
        id="file"
        accept="image/*"
        type="file"
        name="file"
        onChange={insertImg}
        multiple
      />
      <PreviewContainer>
        {previewImg.map((el, index) => {
          return (
            <PreviewImgContainer key={el}>
              {index + 1}
              <PreviewImg src={el} />
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
