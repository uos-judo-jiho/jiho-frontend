import { PageHeader } from "@/components/layouts/PageHeader";
import { MyInfo } from "@/features/user/ui/my-info";
import { User } from "lucide-react";

export const MyPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={User}
        title="마이페이지"
        description="내 계정 정보를 확인하고 관리합니다."
      />
      <div className="grid gap-6">
        <MyInfo />
      </div>
    </div>
  );
};
