import { normalizeNewsResponse } from "@/shared/lib/api/news";
import { ArticleInfoType } from "@/shared/lib/types/ArticleInfoType";
import { v2Api } from "@packages/api";
import { Newspaper } from "lucide-react";
import { useMemo } from "react";
import ImageUploader from "./ImageUploader/ImageUploader";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { useArticleForm } from "./shared/use-article-form";

type NewsGalleryFromProps = {
  year: string;
};

/**
 * 연도별 갤러리 폼.
 *
 * 게시글이 아니라 사진만 저장하므로 제목·작성자·태그·본문이 전부 없다.
 * 지호지 폼과 화면이 거의 겹치지 않아 별도 컴포넌트로 둔다.
 */
const NewsGalleryFrom = ({ year }: NewsGalleryFromProps) => {
  const { data: response } = v2Api.useGetApiV2NewsYear(
    Number(year),
    undefined,
    {
      query: {
        enabled: Boolean(year),
        select: (result) => result.data,
      },
    },
  );

  const newsData = useMemo(
    () => normalizeNewsResponse(response, year),
    [response, year],
  );

  const galleryData: ArticleInfoType | undefined = newsData
    ? {
        id: `${newsData.year}-gallery`,
        imgSrcs: newsData.images.map((src) => ({
          originSrc: src,
          smallSrc: null,
        })),
        title: "",
        author: "",
        dateTime: year,
        tags: [],
        description: "",
      }
    : undefined;

  const form = useArticleForm({
    type: "news",
    data: galleryData,
    gallery: true,
  });

  return (
    <ArticleFormLayout
      form={form}
      title={`${form.values.dateTime.slice(0, 4)}년 갤러리 작성`}
      icon={Newspaper}
    >
      <FormContainer>
        <div>
          <ImageUploader
            setValues={form.setImages}
            data={galleryData?.imgSrcs.map(({ originSrc }) => originSrc)}
            imageLimit={50}
            disabled={form.readOnly}
          />
        </div>
      </FormContainer>
    </ArticleFormLayout>
  );
};

export default NewsGalleryFrom;
