import type { LinkOptions } from "@tanstack/react-router";

/** 서버가 내려주는 앞뒤 글 (BoardDetail.prev / BoardDetail.next) */
type BoardNeighbor = {
  id: number;
  title: string | null;
} | null;

/** 상세 하단 이동 링크 한 칸 */
export type Neighbour = {
  label: string;
  link: LinkOptions;
} | null;

/**
 * 서버의 앞뒤 글을 상세 화면이 쓸 링크로 옮긴다.
 *
 * ## 이름이 헷갈리는 지점
 *
 * 서버는 **시간순**으로 이름을 붙인다 — `prev` 는 "더 과거", `next` 는 "더 최신"
 * 이다. 반면 화면은 **목록 순서**를 따라간다. 세 게시판 모두 최신순으로 내려오니
 * 목록에서 한 칸 위(왼쪽 ←)가 곧 "더 최신"이다. 그래서 좌우와 서버 필드명이 서로
 * 뒤집힌 것처럼 보인다.
 *
 * 이 변환을 호출부마다 손으로 쓰면 언젠가 한 곳이 반대로 꽂힌다. 그래서
 * `ArticleNeighbours` 는 좌우가 아니라 `newer` / `older` 를 받고, 어느 쪽을
 * 어디에 그릴지는 컴포넌트가 정한다. 호출부는 서버 필드를 이름 그대로 넘기면 된다.
 *
 * @param neighbor 서버가 준 앞뒤 글. 없으면 null
 * @param toLink   id 로 라우트 링크를 만드는 함수
 * @param fallbackLabel 제목이 비어 있을 때 대신 보여줄 문구.
 *   훈련일지처럼 제목 없이 올라오는 글이 있어 링크가 빈칸이 되는 것을 막는다.
 */
export const toNeighbour = (
  neighbor: BoardNeighbor | undefined,
  toLink: (id: number) => LinkOptions,
  fallbackLabel: string,
): Neighbour => {
  if (!neighbor) return null;

  return {
    label: neighbor.title?.trim() || fallbackLabel,
    link: toLink(neighbor.id),
  };
};
