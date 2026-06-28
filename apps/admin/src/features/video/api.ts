import { v2AdminModel } from "@packages/api/model";

/**
 * 영상 라벨링 화면에서 쓰는 도메인 타입.
 * orval 로 생성된 모델(@packages/api/model)을 그대로 별칭으로 재노출한다.
 * 실제 데이터 패칭/라벨 저장은 `./hooks` 의 생성 훅을 사용한다.
 */

export type VideoJobStatus = v2AdminModel.GetApiV2AdminVideos200JobsItemStatus;
export type VideoJobListItem = v2AdminModel.GetApiV2AdminVideos200JobsItem;
export type VideoJobDetail = v2AdminModel.GetApiV2AdminVideosJobId200Job;
export type VideoEvent =
  v2AdminModel.GetApiV2AdminVideosJobIdEvents200EventsItem;
export type VideoHighlight =
  v2AdminModel.GetApiV2AdminVideosJobId200JobHighlightsItem &
    Pick<VideoEvent, "isLabeledByCurrentUser">;
export type CurrentUserLabel =
  v2AdminModel.GetApiV2AdminVideosJobId200JobHighlightsItemCurrentUserLabel;

export type CreateVideoLabelBody =
  v2AdminModel.PostApiV2AdminHighlightsHighlightIdLabelBody;
export type TechniqueResult =
  v2AdminModel.PostApiV2AdminHighlightsHighlightIdLabelBodyTechniqueResult;
export type Score = NonNullable<CreateVideoLabelBody["score"]>;
