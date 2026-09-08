/**
 * 지호지 기사·훈련일지·공지가 공통으로 갖는 게시물 형태.
 *
 * 세 도메인이 백엔드에서 같은 모양으로 내려오므로 카드·목록·상세 컴포넌트를
 * 공유할 수 있다. 서로 다른 필드가 생기면 그때 각 feature 로 분리한다.
 */

export type ContentImage = {
  originSrc: string;
  smallSrc: string | null;
};

export type ContentItem = {
  id: string | number;
  title: string;
  author: string;
  /** "YYYY-MM-DD" */
  dateTime: string;
  description: string;
  tags: string[];
  images: ContentImage[];
};

/**
 * 목록 카드가 그리는 축약 게시물 (서버의 BoardSummary).
 *
 * 목록 응답은 마크다운 본문과 사진 전부 대신 평문 `excerpt` 와 대표 사진 한
 * 장만 싣는다 (api#41). 카드가 쓰지 않던 것을 아이템마다 내려받던 낭비가
 * 없어졌고, 대신 상세용 `ContentItem` 과는 모양이 다르므로 타입을 갈랐다.
 */
export type ContentSummary = {
  id: string | number;
  title: string;
  author: string;
  /** "YYYY-MM-DD" */
  dateTime: string;
  tags: string[];
  /** 대표 사진. 첨부가 없으면 null */
  thumbnail: ContentImage | null;
  imageCount: number;
  /** 마크다운 표기를 걷어낸 본문 앞부분 */
  excerpt: string;
};

export type Award = {
  id?: string | number;
  title: string;
  gold: number;
  silver: number;
  bronze: number;
  menGroup: number;
  womenGroup: number;
  group: number;
};
