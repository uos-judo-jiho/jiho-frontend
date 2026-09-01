import ModalDescriptionSection from "@/components/common/Modals/ModalDescriptionSection";
import { useFormContext, useWatch } from "react-hook-form";
import type { ArticleFormValues } from "../lib/article-schema";

type ArticlePreviewProps = {
  /** 작성자 / 태그(참여 인원) / 날짜 자리에 들어갈 라벨. */
  titles: [string, string, string];
};

/** 작성 중인 내용이 상세 화면에서 어떻게 보이는지 그대로 보여준다. */
export const ArticlePreview = ({ titles }: ArticlePreviewProps) => {
  const { control } = useFormContext<ArticleFormValues>();
  const values = useWatch({ control });

  return (
    <>
      <div className="mt-4 py-2 border-t-2 border-b-2 border-gray-300">
        <div className="font-bold text-lg">
          본문 미리보기{" "}
          <span className="text-gray-500 font-normal text-sm">
            (작성한 내용이 어떻게 보이는지 확인하세요)
          </span>
        </div>
        <small>첨부 이미지 미포함</small>
      </div>
      <ModalDescriptionSection
        article={{
          id: "preview-id",
          author: values.author ?? "",
          title: values.title ?? "",
          dateTime: values.dateTime ?? "",
          description: values.description ?? "",
          tags: values.tags ?? [],
          imgSrcs: [],
        }}
        titles={titles}
      />
    </>
  );
};
