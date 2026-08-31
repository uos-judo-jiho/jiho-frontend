/**
 * 반응 종류. 백엔드는 `reaction_type` 을 varchar 로 두고 DTO 의 REACTION_TYPES
 * 배열만 늘리면 이모지 반응을 추가할 수 있게 설계되어 있다 (API PR #35).
 * 지금은 좋아요 하나뿐이라 생성된 클라이언트의 리터럴 타입과 맞춰 둔다.
 */
export type ReactionType = "like";

export type ReactionSummary = {
  count: number;
  reacted: boolean;
};
