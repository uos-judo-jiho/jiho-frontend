import { CommonModal } from "@/components/common/Modals";
import { Button } from "@/components/ui/button";
import { v2Admin } from "@packages/api";
import { PostApiV2AdminMeUpgradeRequestBodyRequestedRole } from "node_modules/@packages/api/src/_generated/v2/admin/model";
import { overlay } from "overlay-kit";
import { useState } from "react";
import { toast } from "sonner";

export const RequestUpdradeButton = () => {
  const upgradeRequestMutation = v2Admin.usePostApiV2AdminMeUpgradeRequest({
    axios: { withCredentials: true },
  });

  const handleOpenModal = () => {
    overlay.open(({ isOpen, close }) => {
      return (
        <RequestUpgradeModal
          isOpen={isOpen}
          onClose={close}
          onConfirm={(role) => {
            upgradeRequestMutation.mutate(
              {
                data: { requestedRole: role },
              },
              {
                onSuccess: () => {
                  toast.success("권한 업그레이드 요청이 제출되었습니다.");
                  close();
                },
                onError: (error: any) => {
                  toast.error(
                    error.response?.data?.message ||
                      "권한 업그레이드 요청 제출에 실패했습니다.",
                  );
                },
              },
            );
          }}
          isPending={upgradeRequestMutation.isPending}
        />
      );
    });
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleOpenModal}
      className="h-7 text-xs"
    >
      권한 요청
    </Button>
  );
};

const RequestUpgradeModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (role: PostApiV2AdminMeUpgradeRequestBodyRequestedRole) => void;
  isPending: boolean;
}) => {
  const [selectedRole, setSelectedRole] = useState<
    PostApiV2AdminMeUpgradeRequestBodyRequestedRole | ""
  >("");

  const roles: {
    value: PostApiV2AdminMeUpgradeRequestBodyRequestedRole;
    label: string;
  }[] = [
    { value: "general", label: "회원" },
    { value: "graduate", label: "졸업생" },
  ];

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="권한 업그레이드 요청"
      description="본인의 역할에 맞는 권한을 선택하여 요청해주세요. 관리자 승인 후 반영됩니다."
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button
            onClick={() => selectedRole && onConfirm(selectedRole)}
            disabled={!selectedRole || isPending}
            className="flex-1"
          >
            {isPending ? "제출 중..." : "요청하기"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-2 py-4">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
              selectedRole === role.value
                ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <span className="font-medium text-sm">{role.label}</span>
            {selectedRole === role.value && (
              <div className="size-2 rounded-full bg-neutral-900" />
            )}
          </button>
        ))}
      </div>
    </CommonModal>
  );
};
