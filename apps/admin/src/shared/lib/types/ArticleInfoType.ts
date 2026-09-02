/**
 * 게시글 한 건. 읽기 응답(BoardDetail)과 같은 모양을 쓴다.
 *
 * 예전에는 사진 필드가 `imgSrcs` 였다. 쓰기 API 가 `imgSrcs: string[]` 만
 * 받았기 때문인데, 정작 담기는 값은 읽기 응답 그대로인 객체 배열이라 이름과
 * 내용이 어긋나 있었다. 이제 쓰기도 `images` 를 받으므로(api#40) 읽기·쓰기·폼이
 * 모두 같은 이름과 모양을 쓴다.
 */
export type ArticleInfoType = {
  id: string | number;
  images: {
    originSrc: string;
    smallSrc: string | null;
  }[];
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
  description: string;
};
