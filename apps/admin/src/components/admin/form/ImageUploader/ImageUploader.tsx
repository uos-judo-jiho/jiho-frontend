import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v2Admin } from "@packages/api";
import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import {
  InputContainer,
  PreviewContainer,
  PreviewImg,
  PreviewImgContainer,
  StyledLabel,
  TagDeleteButton,
} from "../StyledComponent/FormContainer";

type ImageUploaderProps = {
  setValues: (images: (prev: string[]) => string[]) => void;
  data?: string[];
  imageLimit?: number;
  onUpload?: (urls: string[]) => void;
};

interface SortableItemProps {
  id: string;
  index: number;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>, index: number) => void;
}

const SortableImage = ({ id, index, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <PreviewImgContainer
      ref={setNodeRef}
      style={style}
      key={id}
      className="group border border-gray-300 relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <div className="w-full h-full flex items-center justify-center">
          <PreviewImg src={id} />
        </div>
      </div>
      <TagDeleteButton
        className="absolute top-2 right-2 bg-gray-100/50 border border-black/30 rounded-full p-1 hover:bg-white hover:border-black transition-all text-black flex items-center justify-center w-7 h-7 shadow-sm opacity-0 group-hover:opacity-100 z-20"
        onClick={(event) => onDelete(event, index)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </TagDeleteButton>
      <div className="absolute bottom-1 left-1 bg-white/50 text-black-600 size-5 rounded flex items-center justify-center text-xs">
        {index + 1}
      </div>
    </PreviewImgContainer>
  );
};

const ImageUploader = ({
  setValues,
  data,
  imageLimit = 10,
  onUpload,
}: ImageUploaderProps) => {
  const [previewImg, setPreviewImg] = useState<string[]>(data || []);
  const [isFull, setIsFull] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const imageUploadMutation = v2Admin.usePostApiV2AdminImage({
    axios: {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  const handleFiles = async (files: FileList | File[]) => {
    const currentCount = previewImg.length;
    if (currentCount >= imageLimit) {
      alert(`사진은 최대 ${imageLimit}장까지 추가할 수 있습니다.`);
      setIsFull(true);
      return;
    }

    const fileArr = Array.from(files).slice(0, imageLimit - currentCount);

    if (fileArr.length === 0) return;

    for (const file of fileArr) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
    }

    try {
      const uploadPromises = fileArr.map((file) =>
        imageUploadMutation.mutateAsync({
          data: { file },
        }),
      );

      const responses = await Promise.all(uploadPromises);
      const newUrls = responses.map((res) => res.data.url);

      if (newUrls.length > 0) {
        setPreviewImg((prev) => [...prev, ...newUrls]);
        setValues((prev) => [...prev, ...newUrls]);
        onUpload?.(newUrls);
      }

      if (currentCount + newUrls.length >= imageLimit) {
        setIsFull(true);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const deleteImg = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const deletedUrl = previewImg[index];
    setPreviewImg((prev) => prev.filter((_el, idx) => idx !== index));
    setValues((prev) => prev.filter((url) => url !== deletedUrl));
    setIsFull(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPreviewImg((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setValues(() => [...newOrder]);
        return newOrder;
      });
    }
  };

  return (
    <InputContainer>
      <StyledLabel htmlFor="file" aria-required="true">
        사진 올리기 (최대 {imageLimit}장)
      </StyledLabel>
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer
        ${isDragging ? "border-primary bg-muted" : "border-gray-300 bg-background"}
        `}
        style={{ minHeight: 120 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="이미지 드래그 앤 드랍 또는 클릭"
      >
        <input
          ref={inputRef}
          id="file"
          accept="image/*"
          type="file"
          name="file"
          onChange={onFileChange}
          multiple
          className="hidden"
          disabled={isFull || imageUploadMutation.isPending}
        />
        <span className="text-sm text-gray-500">
          이미지를 드래그 앤 드랍하거나 클릭해서 업로드하세요
        </span>
        <span className="text-xs text-gray-400 mt-1">
          (최대 {imageLimit}장, jpg/png/webp 등)
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={previewImg} strategy={rectSortingStrategy}>
          <PreviewContainer className="mt-4">
            {previewImg.map((url, index) => (
              <SortableImage
                key={url}
                id={url}
                index={index}
                onDelete={deleteImg}
              />
            ))}
          </PreviewContainer>
        </SortableContext>
      </DndContext>
    </InputContainer>
  );
};

export default ImageUploader;
