import { RouterUrl } from "@/app/routers/router-url";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  GetApiV2AdminUsers200UsersItemAdditionalInfo,
  GetApiV2AdminUsersUpgradeRequests200RequestsItem,
} from "node_modules/@packages/api/src/_generated/v2/admin/model";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getUserRole } from "../utils/get-user-role";

type WaitedApprovalProps = {
  showAll?: boolean;
};

export const WaitedRole = ({ showAll = false }: WaitedApprovalProps) => {
  const { data: waitedUpgradeRequests } =
    v2Admin.useGetApiV2AdminUsersUpgradeRequestsSuspense({
      query: {
        select: (data) => data.data.requests,
      },
      axios: { withCredentials: true },
    });

  // 업그레이드 요청 응답에는 추가정보가 없어, users 목록을 adminId 로 조인해 표시한다.
  // /users 는 manager 이상만 접근 가능하므로(staff 는 403) Suspense 대신 비차단 쿼리로
  // 조회하고, 실패 시 추가정보 없이 그대로 노출한다(graceful degradation).
  const { data: infoByAdminId } = v2Admin.useGetApiV2AdminUsers(undefined, {
    query: {
      retry: false,
      select: (data) =>
        new Map(data.data.users.map((user) => [user.id, user.additionalInfo])),
    },
    axios: { withCredentials: true },
  });

  if (waitedUpgradeRequests.length === 0) {
    return <p>현재 회원 등급 업그레이드 대기 중인 회원이 없어요.</p>;
  }

  return (
    <div>
      <div className="text-sm flex gap-2 items-center">
        <p className="text-neutral-600">
          현재 등급 업그레이드 대기 중인 회원이 {waitedUpgradeRequests.length}명
          있어요.
        </p>
        {showAll === false ? (
          <Link
            to={RouterUrl.회원.목록}
            className="text-grey-600 hover:underline inline-block"
          >
            {"전체보기 >"}
          </Link>
        ) : null}
      </div>
      <Card className="mt-4 flex flex-col gap-2 p-2 max-h-[400px] overflow-y-auto divide-y divide-gray-200">
        {(showAll
          ? waitedUpgradeRequests
          : waitedUpgradeRequests.slice(0, 3)
        ).map((request) => (
          <ApprovalItem
            request={request}
            additionalInfo={infoByAdminId?.get(request.adminId) ?? null}
            key={request.id}
          />
        ))}
      </Card>
    </div>
  );
};

const ApprovalItem = ({
  request,
  additionalInfo,
}: {
  request: GetApiV2AdminUsersUpgradeRequests200RequestsItem;
  additionalInfo: GetApiV2AdminUsers200UsersItemAdditionalInfo;
}) => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: v2Admin.getGetApiV2AdminUsersUpgradeRequestsQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: v2Admin.getGetApiV2AdminUsersQueryKey(),
      }),
    ]);
  };

  const approvMutation =
    v2Admin.usePostApiV2AdminUsersUpgradeRequestsRequestIdApprove({
      axios: { withCredentials: true },
      mutation: {
        onSuccess: async () => {
          toast.success("회원이 승인되었습니다.");
          await invalidateQueries();
        },
        onError: () => {
          toast.error("회원 승인에 실패했습니다.");
        },
      },
    });

  const rejectMutation =
    v2Admin.usePostApiV2AdminUsersUpgradeRequestsRequestIdReject({
      axios: { withCredentials: true },
      mutation: {
        onSuccess: async () => {
          toast.success("회원이 거절되었습니다.");
          await invalidateQueries();
        },
        onError: () => {
          toast.error("회원 거절에 실패했습니다.");
        },
      },
    });

  const roleText = getUserRole(request.requestedRole);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col p-2 gap-2 justify-between">
        <div className="flex-1 flex gap-1 items-center">
          <p>{format(request.createdAt, "yyyy-MM-dd HH:mm")}</p>
        </div>
        <p className="font-semibold">{request.email}</p>
        <p>
          <b
            className={cn(
              request.requestedRole === "general"
                ? "text-blue-600"
                : "text-gray-600",
            )}
          >
            {roleText}
          </b>{" "}
          권한을 요청했어요.
        </p>
        <UpgradeProfile additionalInfo={additionalInfo} />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            approvMutation.mutate({
              requestId: request.id,
            });
          }}
        >
          승인
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            rejectMutation.mutate({
              requestId: request.id,
            });
          }}
        >
          거절
        </Button>
      </div>
    </div>
  );
};

/** 회원이 입력한 추가정보가 있으면 보여준다(없으면 렌더하지 않음). */
const UpgradeProfile = ({
  additionalInfo,
}: {
  additionalInfo: GetApiV2AdminUsers200UsersItemAdditionalInfo;
}) => {
  if (!additionalInfo) return null;

  const formatPhone = (phone: string) =>
    /^\d{11}$/.test(phone)
      ? `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
      : phone;

  const items: { label: string; value: string }[] = [];
  if (additionalInfo.name) items.push({ label: "이름", value: additionalInfo.name });
  if (additionalInfo.major)
    items.push({ label: "학과", value: additionalInfo.major });
  if (additionalInfo.generation != null)
    items.push({ label: "기수", value: `${additionalInfo.generation}기` });
  if (additionalInfo.studentId)
    items.push({ label: "학번", value: additionalInfo.studentId });
  if (additionalInfo.phoneNumber)
    items.push({ label: "연락처", value: formatPhone(additionalInfo.phoneNumber) });

  if (items.length === 0) return null;

  return (
    <dl className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-500">
      {items.map((item) => (
        <div key={item.label} className="flex gap-1">
          <dt className="text-neutral-400">{item.label}</dt>
          <dd className="text-neutral-700">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
