import * as z from "zod";

const imageSchema = z.object({
  originSrc: z.string(),
  smallSrc: z.string().nullable(),
});

/**
 * 지호지·훈련일지·공지사항 폼 값.
 *
 * 세 게시판은 화면이 갈라져도 저장하는 필드는 같다. 훈련일지에서 `tags` 는
 * 참여 인원을 담는다.
 */
export const articleFormSchema = z.object({
  author: z.string().trim().min(1, "작성자를 입력해주세요."),
  title: z.string().trim().min(1, "제목을 입력해주세요."),
  dateTime: z.string().min(1, "날짜를 선택해주세요."),
  tags: z.array(z.string().trim().min(1, "빈 태그는 저장할 수 없어요.")),
  description: z.string().trim().min(1, "본문을 입력해주세요."),
  images: z.array(imageSchema),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

/**
 * 갤러리는 연도별 사진만 저장한다. 작성자·제목·본문 입력란이 아예 없으므로
 * 그 세 필드의 필수 검사를 푼다. 사진을 모두 지우는 것도 의도된 동작이라
 * 개수는 따로 막지 않는다. 추론되는 타입은 같아서 폼은 하나로 쓴다.
 */
export const galleryFormSchema = articleFormSchema.extend({
  author: z.string(),
  title: z.string(),
  description: z.string(),
});

export const EMPTY_ARTICLE_VALUES: ArticleFormValues = {
  author: "",
  title: "",
  tags: [],
  description: "",
  dateTime: "",
  images: [],
};
