import React, { useEffect, useState } from "react";
import { getImageFileFromSrc, toBase64 } from "@/lib/utils/Utils";
import {
  InputContainer,
  PreviewContainer,
  PreviewImg,
  PreviewImgContainer,
  PreviewName,
  StyledLabel,
  TagDeleteButton,
} from "../StyledComponent/FormContainer";

import { Input } from "@/components/ui/input";
import { useFileUpload } from "@/hooks/upload/useFileUpload";
import { UploadProgress } from "./UploadProgress";

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
  const [img, setImg] = useState<File[]>([]);
  const [previewImg, setPreviewImg] = useState<string[]>(data || []);

  const [isFull, setIsFull] = useState<boolean>(false);

  useEffect(() => {
    const convertFileFromSrc = async () => {
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

    convertFileFromSrc();
  }, [data, previewImg]);

  // 업로드 완료 콜백: URL을 받아서 직접 업데이트
  const handleUploadComplete = (_uploadId: string, url: string) => {
    setValues((prev) => {
      return [...prev, url];
    });
  };

  const { uploadMultipleFiles, uploadsArray, cancelUpload, clearCompleted } =
    useFileUpload({
      onComplete: handleUploadComplete,
    });

  const insertImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const fileList = Array.from(event.target.files).slice(
      0,
      imageLimit - img.length
    );

    // 미리보기용 base64 생성 (즉시 표시)
    const base64Promises: Promise<string>[] = fileList.map((file) =>
      toBase64(file)
    );

    try {
      const urlList = await Promise.all(base64Promises);
      setPreviewImg([...previewImg, ...urlList]);
      setImg([...img, ...fileList]);
      setValues((prev) => [...prev, ...urlList]);

      // S3에 비동기 업로드 시작 (UI 차단 없음)
      await uploadMultipleFiles(fileList, "images");
    } catch (error) {
      console.error("Error:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const deleteImg = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();

    const deletedUrl = previewImg[index];

    // 미리보기 및 파일 배열에서 제거
    const imgArr = img.filter((_el, idx) => idx !== index);
    const imgNameArr = previewImg.filter((_el, idx) => idx !== index);

    setImg([...imgArr]);
    setPreviewImg([...imgNameArr]);

    // 업로드된 URL에서도 제거하고 부모 컴포넌트에 전달
    if (!deletedUrl.startsWith("data:")) {
      setValues((prev) => {
        const newUrls = prev.filter((url) => url !== deletedUrl);
        return newUrls;
      });
    }
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

      {/* 업로드 진행 상황 표시 */}
      <UploadProgress
        uploads={uploadsArray}
        onCancel={cancelUpload}
        clearUploads={clearCompleted}
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
