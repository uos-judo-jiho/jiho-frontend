import { Badge } from "@/components/common/badge";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRole } from "@/features/user/utils/get-user-role";
import { v2Admin } from "@packages/api";
import { format } from "date-fns";
import { Info, User } from "lucide-react";

export const MyPage = () => {
  const { data: user } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={User}
        title="마이페이지"
        description="내 계정 정보를 확인하고 관리합니다."
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-neutral-500">
                이메일
              </span>
              <span className="col-span-2 text-sm font-semibold">
                {user.email}
              </span>
            </div>
            <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-neutral-500">권한</span>
              <div className="col-span-2 flex flex-col gap-1">
                <Badge
                  theme={
                    ["root", "president", "manager"].includes(user.role)
                      ? "blue"
                      : "gray"
                  }
                >
                  {getUserRole(user.role)}
                </Badge>
                {user.role === "etc" ? (
                  <div className="flex items-center gap-1 text-sm text-neutral-500">
                    <Info className="size-4 inline-block" />
                    <p className="text-sm">
                      유도부 회원이신가요? 권한을 요청해주세요.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
              <span className="text-sm font-medium text-neutral-500">
                가입일
              </span>
              <span className="col-span-2 text-sm">
                {format(user.createdAt, "yyyy년 MM월 dd일")}
              </span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-neutral-500">
                계정 ID
              </span>
              <span className="col-span-2 text-sm font-mono text-neutral-400">
                {user.id}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50 border-dashed">
          <CardContent className="pt-6">
            <p className="text-sm text-neutral-500 text-center">
              비밀번호 변경 및 정보 수정 기능은 준비 중입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
