import { Badge } from "@/components/common/badge";
import SkeletonItem from "@/components/common/Skeletons/SkeletonItem";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRole } from "@/features/user/utils/get-user-role";
import { v2Admin } from "@packages/api";
import { v2AdminModel } from "@packages/api/model";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { User as UserIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { match } from "ts-pattern";

type UserRole = v2AdminModel.GetApiV2AdminUsers200UsersItemRole;

const ROLES: { value: UserRole; label: string }[] = [
  { value: "root", label: "관리자" },
  { value: "president", label: "회장" },
  { value: "manager", label: "운영진" },
  { value: "staff", label: "운영 부원" },
  { value: "general", label: "회원" },
  { value: "graduate", label: "졸업생" },
  { value: "etc", label: "외부인 (기타)" },
];

const ROLE_PRIORITY: Record<UserRole, number> = {
  root: 0,
  president: 1,
  manager: 2,
  staff: 3,
  general: 4,
  graduate: 5,
  etc: 6,
};

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={UserIcon}
        title="회원 상세 정보"
        description="회원의 기본 정보 및 추가 정보를 확인하고 관리합니다."
      />
      <Suspense fallback={<UserDetailSkeleton />}>
        <UserDetailContent id={Number(id)} />
      </Suspense>
    </div>
  );
};

const UserDetailContent = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const [isEditingRole, setIsEditingRole] = useState(false);

  const { data: me } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: { select: (data) => data.data.user },
  });

  const { data: user } = v2Admin.useGetApiV2AdminUsersAdminId(id, {
    axios: { withCredentials: true },
    query: { select: (data) => data.data.user },
  });

  const updateRoleMutation = v2Admin.usePatchApiV2AdminUsersAdminIdRole({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () => {
        toast.success("역할이 성공적으로 변경되었습니다.");
        queryClient.invalidateQueries({
          queryKey: v2Admin.getGetApiV2AdminUsersQueryKey(),
        });
        setIsEditingRole(false);
      },
      onError: () => {
        toast.error("역할 변경에 실패했습니다.");
      },
    },
  });

  if (!user) {
    return <div>유저를 찾을 수 없습니다.</div>;
  }

  const isStaffOrAbove = ["root", "president", "manager", "staff"].includes(
    me.role,
  );
  const myPriority = ROLE_PRIORITY[me.role as UserRole] ?? 99;
  const userPriority = ROLE_PRIORITY[user.role as UserRole] ?? 99;

  // 자기를 포함하여 자기보다 높은 권한의 유저는 수정 불가 (동일 권한도 수정 불가하게 설정)
  const canManageRole = isStaffOrAbove && myPriority < userPriority;

  const handleRoleChange = (newRole: UserRole) => {
    updateRoleMutation.mutate({
      adminId: id,
      data: { role: newRole },
    });
  };

  const isGraduated = user.additionalInfo?.graduationYear
    ? user.additionalInfo.graduationYear <= new Date().getFullYear()
    : null;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">이메일</span>
            <span className="col-span-2 text-sm font-semibold">
              {user.email}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">권한</span>
            <div className="col-span-2 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {isEditingRole ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="text-sm border rounded p-1"
                      defaultValue={user.role}
                      onChange={(e) =>
                        handleRoleChange(e.target.value as UserRole)
                      }
                      disabled={updateRoleMutation.isPending}
                    >
                      {ROLES.map((role) => (
                        <option
                          key={role.value}
                          value={role.value}
                          disabled={ROLE_PRIORITY[role.value] <= myPriority}
                        >
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingRole(false)}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge
                      theme={
                        ["root", "president", "manager"].includes(user.role)
                          ? "blue"
                          : "gray"
                      }
                    >
                      {getUserRole(user.role as any)}
                    </Badge>
                    {canManageRole && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setIsEditingRole(true)}
                      >
                        변경
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">가입일</span>
            <span className="col-span-2 text-sm">
              {format(new Date(user.createdAt), "yyyy년 MM월 dd일")}
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium text-neutral-500">
              계정 ID
            </span>
            <span className="col-span-2 text-sm font-mono text-neutral-400">
              {user.id}
            </span>
          </div>
        </CardContent>

        <CardHeader>
          <CardTitle className="text-lg">추가 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">이름</span>
            <span className="col-span-2 text-sm font-semibold">
              {user.additionalInfo?.name ?? "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">기수</span>
            <span className="col-span-2 text-sm">
              {user.additionalInfo?.generation
                ? `${user.additionalInfo?.generation}기`
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">학번</span>
            <span className="col-span-2 text-sm">
              {user.additionalInfo?.studentId ?? "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">학과</span>
            <span className="col-span-2 text-sm">
              {user.additionalInfo?.major ?? "-"}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
            <span className="text-sm font-medium text-neutral-500">연락처</span>
            <span className="col-span-2 text-sm">
              {user.additionalInfo?.phoneNumber
                ? user.additionalInfo.phoneNumber.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    "$1-$2-$3",
                  )
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-sm font-medium text-neutral-500">
              졸업 여부
            </span>
            <span className="col-span-2 text-sm">
              {match(isGraduated)
                .with(true, () => <Badge>졸업생</Badge>)
                .with(false, () => <Badge theme="green">재학생</Badge>)
                .otherwise(() => "-")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UserDetailSkeleton = () => (
  <Card>
    <CardHeader>
      <SkeletonItem className="h-6 w-24" />
    </CardHeader>
    <CardContent className="space-y-4">
      <SkeletonItem className="h-10 w-full" />
      <SkeletonItem className="h-10 w-full" />
      <SkeletonItem className="h-10 w-full" />
    </CardContent>
  </Card>
);
