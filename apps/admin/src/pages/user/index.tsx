import { RouterUrl } from "@/app/routers/router-url";
import { v2Admin } from "@packages/api";
import { Users } from "lucide-react";
import { Navigate } from "react-router-dom";
import PageHeader from "@/components/layouts/PageHeader";

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
        description="시스템에 등록된 회원을 관리합니다."
      />

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 text-center">
          <p className="text-neutral-500">회원 목록 기능을 준비 중입니다.</p>
        </div>
      </div>
    </div>
  );
};
