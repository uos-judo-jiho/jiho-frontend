import { v2Api } from "@packages/api";
import { Newspaper } from "lucide-react";
import { FormContainer } from "./StyledComponent/FormContainer";
import { ArticleFormLayout } from "./shared/article-form-layout";
import { ImageField } from "./shared/fields";
import { useArticleForm } from "./shared/use-article-form";

type NewsGalleryFromProps = {
  year: string;
};

/** 한 해 사진을 받는 최대 장수 (서버 상한) */
const GALLERY_IMAGE_LIMIT = 200;

/**
 * 연도별 갤러리 폼.
 *
 * 게시글이 아니라 사진만 저장하므로 제목·작성자·태그·본문이 전부 없다.
 * 지호지 폼과 화면이 거의 겹치지 않아 별도 컴포넌트로 둔다.
 */
const NewsGalleryFrom = ({ year }: NewsGalleryFromProps) => {
  // 폼 기본값을 첫 렌더에 채워야 해서 suspense 로 받는다. 값이 늦게 도착하면
  // 이미 만들어진 폼에는 반영되지 않아 기존 사진이 통째로 비어 보인다.
  // 갤러리는 별도 엔드포인트로 갈라졌고, 그 해 기사 목록을 함께 받던 것이
  // 사진만 받는 것으로 줄었다 (api#41).
  const { data: images } = v2Api.useGetGallerySuspense(
    Number(year),
    { limit: GALLERY_IMAGE_LIMIT },
    { query: { select: (result) => result.data.items } },
  );

  const form = useArticleForm({
    type: "news",
    gallery: true,
    data: {
      id: `${year}-gallery`,
      images,
      title: "",
      author: "",
      dateTime: year,
      tags: [],
      description: "",
    },
  });

  return (
    <ArticleFormLayout
      form={form}
      title={`${year.slice(0, 4)}년 갤러리 작성`}
      icon={Newspaper}
    >
      <FormContainer>
        <div>
          <ImageField imageLimit={50} disabled={form.readOnly} />
        </div>
      </FormContainer>
    </ArticleFormLayout>
  );
};

export default NewsGalleryFrom;
