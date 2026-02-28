import { v2Admin } from "@packages/api";
import { Users } from "lucide-react";
import { Navigate } from "react-router-dom";
import { RouterUrl } from "@/app/routers/router-url";

const MemberList = () => {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Users className="w-6 h-6 text-neutral-900" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">회원 관리</h2>
            <p className="text-neutral-500 text-sm">시스템에 등록된 회원을 관리합니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 text-center">
          <p className="text-neutral-500">회원 목록 기능을 준비 중입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
