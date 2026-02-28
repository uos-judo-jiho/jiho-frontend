import { Card, CardDescription } from "@/components/ui/card";
import { getApprovalStatus } from "@/features/members/utils/get-approval-status";
import { cn } from "@/shared/lib/utils";
import { v2Admin } from "@packages/api";
import { Suspense } from "react";

export const HomePage = () => {
  const { data: meData } = v2Admin.useGetApiV2AdminMe({
    query: { retry: false, select: (data) => data.data },
    axios: { withCredentials: true },
  });

  const userRole = meData?.user.role;
  const canManageMembers =
    userRole && ["root", "president", "manager", "staff"].includes(userRole);

  if (!canManageMembers) {
    return (
      <div>
        안녕하세요. {meData?.user.email}님!
        <br />
        <p className="text-center">
          유도부 지호 관리자 페이지에 오신 것을 환영합니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Suspense>
        <WaitedApproval />
      </Suspense>
    </div>
  );
};

const WaitedApproval = () => {
  const { data: approvalData } = v2Admin.useGetApiV2AdminPendingSuspense({
    query: { select: (data) => data.data.admins },
    axios: { withCredentials: true },
  });

  if (approvalData.length === 0) {
    return (
      <div className="p-4">
        현재 승인 대기 중인 회원이 없습니다.
        <br />
        <p className="text-center">좋은 하루 보내세요!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold">승인 대기 중인 회원</h2>
      <p className="mt-2 text-sm text-neutral-600">
        현재 승인 대기 중인 회원이 {approvalData.length}명 있습니다.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {approvalData.slice(0, 3).map((admin) => (
          <Card key={admin.id} className="p-4 gap-2">
            {/* 뱃지 */}
            <div
              className={cn(
                admin.status === "pending"
                  ? "bg-blue-100 text-blue-800"
                  : admin.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                "w-fit px-2 py-1 rounded-full text-sm font-medium",
              )}
            >
              {getApprovalStatus(admin.status)}
            </div>
            <div>
              <p className="text-lg font-semibold">{admin.email}</p>
            </div>
            <CardDescription>
              요청 시간: {new Date(admin.createdAt).toLocaleString()}
            </CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
};
