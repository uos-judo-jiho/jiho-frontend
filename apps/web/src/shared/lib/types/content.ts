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
