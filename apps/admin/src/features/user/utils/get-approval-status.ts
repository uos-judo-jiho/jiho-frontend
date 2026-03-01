import { GetApiV2AdminPending200AdminsItemStatus } from "node_modules/@packages/api/src/_generated/v2/admin/model";

export const getApprovalStatus = (
  status: GetApiV2AdminPending200AdminsItemStatus,
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
