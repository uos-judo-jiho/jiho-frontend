import { RouterUrl } from "@/app/routers/router-url";
import { PageHeader } from "@/components/layouts/PageHeader";
import { UserTable } from "@/features/user/ui/user-table";
import { WaitedApproval } from "@/features/user/ui/waited-approval-card";
import { WaitedRole } from "@/features/user/ui/waited-role-card";
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
      <div className="flex flex-col gap-4">
        <Section title="가입 승인 대기">
          <Suspense>
            <WaitedApproval showAll />
          </Suspense>
        </Section>

        <Section title="등급 업그레이드 대기">
          <Suspense>
            <WaitedRole showAll />
          </Suspense>
        </Section>
        <Section title="회원 목록">
          <Suspense>
            <UserTable />
          </Suspense>
        </Section>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
};
