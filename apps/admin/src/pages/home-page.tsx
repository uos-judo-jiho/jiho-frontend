import { RequestUpdradeButton } from "@/features/user/ui/request-updrade-button";
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
    return <CommonSection />;
  }

  return <AdminSection />;
};

const CommonSection = () => {
  const { data: meData } = v2Admin.useGetApiV2AdminMe({
    query: { retry: false, select: (data) => data.data },
    axios: { withCredentials: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        안녕하세요. {meData?.user.email}님!
        <br />
      </div>
      {meData?.user.role === "etc" ? (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm text-neutral-500">
            유도부 회원이신가요? 관리자에게 등급 업그레이드를 요청하시면 더
            다양한 기능을 이용하실 수 있어요.
          </p>
          <RequestUpdradeButton />
        </div>
      ) : null}
    </div>
  );
};

const AdminSection = () => {
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
