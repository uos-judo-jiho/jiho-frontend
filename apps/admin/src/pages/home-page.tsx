import { WaitedApproval } from "@/features/user/ui/waited-approval-card";
import { WaitedRole } from "@/features/user/ui/waited-role-card";
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
          유도부 지호 관리자 페이지에 오신 것을 환영해요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Suspense>
        <Section title="가입 승인 대기">
          <WaitedApproval />
        </Section>
      </Suspense>
      <Suspense>
        <Section title="등급 업그레이드 대기">
          <WaitedRole />
        </Section>
      </Suspense>
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
