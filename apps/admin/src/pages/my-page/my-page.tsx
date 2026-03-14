import { RouterUrl } from "@/app/routers/router-url";
import { PageHeader } from "@/components/layouts/PageHeader";
import { MyInfo } from "@/features/user/ui/my-info";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

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
        <div>
          <Link
            to={RouterUrl.마이페이지.비밀번호변경}
            className="text-sm text-neutral-600 hover:underline"
          >
            비밀번호 변경
          </Link>
        </div>
      </div>
    </div>
  );
};
