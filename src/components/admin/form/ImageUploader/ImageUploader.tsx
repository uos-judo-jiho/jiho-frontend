import React, { useEffect, useState } from "react";
import { getImageFileFromSrc, toBase64 } from "../../../../utils/Utils";
import { InputContainer, PreviewContainer, PreviewImg, PreviewImgContainer, PreviewName, StyledInput, StyledLabel, TagDeleteButton } from "../StyledComponent/FormContainer";
import Loading from "../../../Skeletons/Loading";

type ImageUploaderProps = {
  setValues: (images: string[]) => void;
  data?: string[];
  imageLimit?: number;
};

const ImageUploader = ({ setValues, data, imageLimit = 10 }: ImageUploaderProps) => {
  const [img, setImg] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<string[]>(data || []);
  const [isFull, setIsFull] = useState<boolean>(false);

  useEffect(() => {
    const _convertFileFromSrc = async () => {
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
    };
    (async () => await _convertFileFromSrc())();
  }, [data, previewImg]);

  const insertImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFull) {
      alert(`사진은 최대 ${imageLimit}장까지 추가할 수 있습니다.`);
      return;
    }

    if (img.length > imageLimit) {
      setIsFull(true);
      return;
    }

    if (!event.target.files) {
      return;
    }

    setImg([...img, ...Array.from(event.target.files)].slice(0, imageLimit));

    const fileList = Array.from(event.target.files).slice(0, imageLimit);

    const base64Promises: Promise<string>[] = fileList.map((file) => toBase64(file));

    Promise.all(base64Promises)
      .then((urlList: string[]) => {
        setPreviewImg(urlList);
        setValues(urlList);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteImg = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    const imgArr = img.filter((_el, idx) => idx !== index);
    const imgNameArr = previewImg.filter((_el, idx) => idx !== index);

    setImg([...imgArr]);
    setPreviewImg([...imgNameArr]);

    setValues([...imgNameArr]);
  };

  return (
    <InputContainer>
      <StyledLabel htmlFor="file" aria-required="true">
        사진 올리기 (최대 {imageLimit}장)
      </StyledLabel>
      <StyledInput id="file" accept="image/*" type="file" name="file" onChange={insertImg} multiple />
      <PreviewContainer>
        {previewImg.map((el, index) => (
          <PreviewImgContainer key={el}>
            {index + 1}
            <PreviewImg src={el} />
            <TagDeleteButton onClick={(event) => deleteImg(event, index)}>
              <PreviewName>❌</PreviewName>
            </TagDeleteButton>
          </PreviewImgContainer>
        ))}
      </PreviewContainer>
    </InputContainer>
  );
};

export default ImageUploader;
