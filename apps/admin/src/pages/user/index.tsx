import { RouterUrl } from "@/app/routers/router-url";
import PageHeader from "@/components/layouts/PageHeader";
import { WaitedApproval } from "@/features/user/ui/waited-approval-card";
import { v2Admin } from "@packages/api";
import { Users } from "lucide-react";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";

export const UserPage = () => {
  const { data: meData, isLoading } = v2Admin.useGetApiV2AdminMe({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data,
    },
  });

  if (isLoading) return null;

  const role = meData?.user.role;
  const allowedRoles = ["root", "president", "manager", "staff"];

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={RouterUrl.홈} replace />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="회원 관리"
        description="시스템에 등록된 회원을 관리해요."
      />
      <Suspense>
        <WaitedApproval showAll />
      </Suspense>
    </div>
  );
};
