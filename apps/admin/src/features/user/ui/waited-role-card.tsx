import { RouterUrl } from "@/app/routers/router-url";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { GetApiV2AdminUsersUpgradeRequests200RequestsItem } from "node_modules/@packages/api/src/_generated/v2/admin/model";
import { Link } from "react-router-dom";
import { toast } from "sonner";

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

  if (waitedUpgradeRequests.length === 0) {
    return <p>현재 회원 등급 업그레이드 대기 중인 회원이 없어요.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">회원 등급 업그레이드 대기 중인 회원</h2>
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
          <ApprovalItem request={request} key={request.id} />
        ))}
      </Card>
    </div>
  );
};

const ApprovalItem = ({
  request,
}: {
  request: GetApiV2AdminUsersUpgradeRequests200RequestsItem;
}) => {
  const queryClient = useQueryClient();

  const approvMutation =
    v2Admin.usePostApiV2AdminUsersUpgradeRequestsRequestIdApprove({
      axios: { withCredentials: true },
      mutation: {
        onSuccess: () => {
          toast.success("회원이 승인되었습니다.");
          queryClient.invalidateQueries({
            queryKey: v2Admin.getGetApiV2AdminUsersUpgradeRequestsQueryKey(),
          });
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
        onSuccess: () => {
          toast.success("회원이 거절되었습니다.");
          queryClient.invalidateQueries({
            queryKey: v2Admin.getGetApiV2AdminUsersUpgradeRequestsQueryKey(),
          });
        },
        onError: () => {
          toast.error("회원 거절에 실패했습니다.");
        },
      },
    });

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col p-2 gap-2 justify-between">
        <div className="flex-1 flex gap-1 items-center">
          {/* <Badge theme="blue">{getApprovalStatus(admin.status)}</Badge> */}
          <p>{format(request.createdAt, "yyyy-MM-dd HH:mm")}</p>
        </div>
        <p className="font-semibold">{request.email}</p>
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
