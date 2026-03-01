import { GetApiV2AdminUsers200UsersItemRole } from "node_modules/@packages/api/src/_generated/v2/admin/model";

export const getUserRole = (role: GetApiV2AdminUsers200UsersItemRole) => {
  switch (role) {
    case "root":
      return "관리자";
    case "president":
      return "회장";
    case "manager":
      return "운영진";
    case "staff":
      return "운영 부원";
    case "general":
      return "회원";
    case "graduate":
      return "졸업생";
    case "etc":
      return "외부인 (기타)";
    default:
      throw new Error(`알 수 없는 역할: ${role}`);
  }
};
