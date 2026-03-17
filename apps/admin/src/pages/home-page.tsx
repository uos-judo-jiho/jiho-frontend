import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import { RequestUpdradeButton } from "@/features/user/ui/request-updrade-button";
import { WaitedApproval } from "@/features/user/ui/waited-approval-card";
import { WaitedRole } from "@/features/user/ui/waited-role-card";
import { v2Admin } from "@packages/api";
import { Suspense } from "react";

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<SkeletonItem className="h-20 w-full" />}>
        <CommonSection />
      </Suspense>
      <Inner />
    </div>
  );
};

const Inner = () => {
  const { data: userRole } = v2Admin.useGetApiV2AdminMeSuspense({
    query: { retry: false, select: (data) => data.data.user.role },
    axios: { withCredentials: true },
  });

  const canManageMembers = userRole && ["root", "president", "manager", "staff"].includes(userRole);

  if (!canManageMembers) {
    return (
      <Suspense fallback={<SkeletonItem className="h-20 w-full" />}>
        <UnauthorizedSection />
      </Suspense>
    );
  }

  return <AdminSection />;
};

const UnauthorizedSection = () => {
  const { data: meData } = v2Admin.useGetApiV2AdminMeSuspense({
    query: { retry: false, select: (data) => data.data },
    axios: { withCredentials: true },
  });

  const hasPendingUpgradeRequest = meData?.user.pendingUpgradeRequest?.status === "pending";
  return (
    <div>
      {meData.user.role === "etc" && hasPendingUpgradeRequest === false ? (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm text-neutral-900">유도부 회원이신가요? 관리자에게 등급 업그레이드를 요청하시면 더 다양한 기능을 이용하실 수 있어요.</p>
          <RequestUpdradeButton />
        </div>
      ) : null}
      {hasPendingUpgradeRequest === true && (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm text-yellow-600">등급 업그레이드 요청이 관리자 승인 대기 중이에요.</p>
        </div>
      )}
    </div>
  );
};

const CommonSection = () => {
  const { data: meData } = v2Admin.useGetApiV2AdminMeSuspense({
    query: { retry: false, select: (data) => data.data },
    axios: { withCredentials: true },
  });

  const isGraduate = meData.user.role === "graduate";

  return (
    <div>
      안녕하세요. <b>{meData.user.additionalInfo?.name ?? meData.user.email}</b>
      님!
      <br />
      {isGraduate ? "졸업생을 위한 기능은 준비 중이에요. 문의사항은 34기 김영민에게 연락주세요!" : null}
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
};
