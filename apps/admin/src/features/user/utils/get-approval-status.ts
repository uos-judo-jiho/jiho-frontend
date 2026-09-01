import type { v2AdminModel } from "@packages/api/model";

export const getApprovalStatus = (
  status: v2AdminModel.GetApiV2AdminPending200AdminsItemStatus,
) => {
  switch (status) {
    case "pending":
      return "가입 요청";
    case "approved":
      return "가입 완료";
    case "rejected":
      return "가입 거절";
    default:
      return "알 수 없음";
  }
};
