import { Input } from "@/components/ui/input";
import { v2Admin } from "@packages/api";
import React, { useState } from "react";
import {
  InputContainer,
  PreviewContainer,
  PreviewImg,
  PreviewImgContainer,
  PreviewName,
  StyledLabel,
  TagDeleteButton,
} from "../StyledComponent/FormContainer";

type ImageUploaderProps = {
  setValues: (images: (prev: string[]) => string[]) => void;
  data?: string[];
  imageLimit?: number;
};

const ImageUploader = ({
  setValues,
  data,
  imageLimit = 10,
}: ImageUploaderProps) => {
  const [previewImg, setPreviewImg] = useState<string[]>(data || []);

  const [isFull, setIsFull] = useState<boolean>(false);

  const imageUploadMutation = v2Admin.usePostApiV2AdminImage({
    axios: {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  const insertImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFull) {
      alert(`사진은 최대 ${imageLimit}장까지 추가할 수 있습니다.`);
      return;
    }

    if (previewImg.length >= imageLimit) {
      setIsFull(true);
      return;
    }

    if (!event.target.files) {
      return;
    }

    const fileList = Array.from(event.target.files).slice(
      0,
      imageLimit - previewImg.length,
    );

    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
    }

    const imageUploadPromises = fileList.map((file) =>
      imageUploadMutation.mutateAsync(
        {
          data: {
            file,
          },
        },
        {
          onSuccess: (response) => {
            const uploadedImageUrl = response.data.url;

            // 업로드된 이미지 URL로 미리보기 업데이트
            setPreviewImg((prev) => [...prev, uploadedImageUrl]);
            setValues((prev) => [...prev, uploadedImageUrl]);
          },
          onError: (error) => {
            console.error("Image upload failed:", error);
            alert("이미지 업로드에 실패했습니다.");
          },
        },
      ),
    );

    await Promise.all(imageUploadPromises);
  };

  const deleteImg = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();

    const deletedUrl = previewImg[index];

    setPreviewImg((prev) => prev.filter((_el, idx) => idx !== index));

    setValues((prev) => prev.filter((url) => url !== deletedUrl));
  };

  return (
    <InputContainer>
      <StyledLabel htmlFor="file" aria-required="true">
        사진 올리기 (최대 {imageLimit}장)
      </StyledLabel>
      <Input
        id="file"
        accept="image/*"
        type="file"
        name="file"
        onChange={insertImg}
        multiple
      />

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
