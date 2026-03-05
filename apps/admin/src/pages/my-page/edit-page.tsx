import { PageHeader } from "@/components/layouts/PageHeader";
import { EditMyInfoForm } from "@/features/user/ui/edit-my-info-form";
import { UserCog } from "lucide-react";

export const EditPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={UserCog}
        title="회원 정보 수정"
        description="회원 정보를 수정합니다."
      />
      <div className="max-w-2xl">
        <EditMyInfoForm />
      </div>
    </div>
  );
};
