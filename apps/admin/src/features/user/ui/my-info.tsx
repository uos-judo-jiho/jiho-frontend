import { Badge } from "@/components/common/badge";
import { CommonModal } from "@/components/common/Modals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { v2Admin } from "@packages/api";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { PostApiV2AdminMeUpgradeRequestBodyRequestedRole } from "node_modules/@packages/api/src/_generated/v2/admin/model";
import { overlay } from "overlay-kit";
import { useState } from "react";
import { toast } from "sonner";
import { getUserRole } from "../utils/get-user-role";

export const MyInfo = () => {
  const { data: user } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.user,
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">기본 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
          <span className="text-sm font-medium text-neutral-500">이메일</span>
          <span className="col-span-2 text-sm font-semibold">{user.email}</span>
        </div>
        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
          <span className="text-sm font-medium text-neutral-500">권한</span>
          <div className="col-span-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge
                theme={
                  ["root", "president", "manager"].includes(user.role)
                    ? "blue"
                    : "gray"
                }
              >
                {getUserRole(user.role)}
              </Badge>
            </div>
            {user.role === "etc" ? (
              <div className="flex items-center gap-1 text-sm text-neutral-500 mt-1">
                <Info className="size-3 inline-block" />
                <p className="text-xs">
                  유도부 회원이신가요? 권한을 요청해주세요.
                </p>
                {user.role === "etc" ? <RequestUpdradeButton /> : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
          <span className="text-sm font-medium text-neutral-500">가입일</span>
          <span className="col-span-2 text-sm">
            {format(new Date(user.createdAt), "yyyy년 MM월 dd일")}
          </span>
        </div>
        <div className="grid grid-cols-3">
          <span className="text-sm font-medium text-neutral-500">계정 ID</span>
          <span className="col-span-2 text-sm font-mono text-neutral-400">
            {user.id}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const RequestUpdradeButton = () => {
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
            onClick={() =>
              selectedRole &&
              onConfirm(
                selectedRole as PostApiV2AdminMeUpgradeRequestBodyRequestedRole,
              )
            }
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
