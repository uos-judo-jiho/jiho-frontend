import { Badge } from "@/components/common/badge";
import { v2Admin } from "@packages/api";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { getUserRole } from "../utils/get-user-role";
import { RequestUpdradeButton } from "./request-updrade-button";

export const CommonMyInfo = () => {
  const { data: user } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user,
    },
  });
  return (
    <>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">이메일</span>
        <span className="col-span-2 text-sm font-semibold">{user.email}</span>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">권한</span>
        <div className="col-span-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge
              theme={
                ["root", "president", "manager"].includes(user.role)
                  ? "blue"
                  : "gray"
              }
            >
              {getUserRole(user.role)}
            </Badge>
          </div>
          {user.role === "etc" ? (
            <div className="flex items-center gap-1 text-sm text-neutral-500 mt-1">
              <Info className="size-3 inline-block" />
              <p className="text-xs">
                유도부 회원이신가요? 권한을 요청해주세요.
              </p>
              {user.role === "etc" ? <RequestUpdradeButton /> : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
        <span className="text-sm font-medium text-neutral-500">가입일</span>
        <span className="col-span-2 text-sm">
          {format(new Date(user.createdAt), "yyyy년 MM월 dd일")}
        </span>
      </div>
      <div className="grid grid-cols-3">
        <span className="text-sm font-medium text-neutral-500">계정 ID</span>
        <span className="col-span-2 text-sm font-mono text-neutral-400">
          {user.id}
        </span>
      </div>
    </>
  );
};
