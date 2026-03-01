import { RouterUrl } from "@/app/routers/router-url";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { v2Admin } from "@packages/api";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { GetApiV2AdminPending200AdminsItem } from "node_modules/@packages/api/src/_generated/v2/admin/model/getApiV2AdminPending200AdminsItem";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getApprovalStatus } from "../utils/get-approval-status";

type WaitedApprovalProps = {
  showAll?: boolean;
};

export const WaitedApproval = ({ showAll = false }: WaitedApprovalProps) => {
  const { data: approvalData } = v2Admin.useGetApiV2AdminPendingSuspense({
    query: {
      select: (data) =>
        data.data.admins.filter((admin) => admin.status === "pending"),
    },
    axios: { withCredentials: true },
  });

  if (approvalData.length === 0) {
    return <p>현재 승인 대기 중인 회원이 없어요.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">승인 대기 중인 회원</h2>
      <div className="text-sm flex gap-2 items-center">
        <p className="text-neutral-600">
          현재 승인 대기 중인 회원이 {approvalData.length}명 있어요.
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
        {(showAll ? approvalData : approvalData.slice(0, 3)).map((admin) => (
          <ApprovalItem admin={admin} key={admin.id} />
        ))}
      </Card>
    </div>
  );
};

const ApprovalItem = ({
  admin,
}: {
  admin: GetApiV2AdminPending200AdminsItem;
}) => {
  const queryClient = useQueryClient();

  const approvMutation = v2Admin.usePostApiV2AdminApproveId({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () => {
        toast.success("회원이 승인되었습니다.");
        queryClient.invalidateQueries({
          queryKey: v2Admin.getGetApiV2AdminPendingQueryKey(),
        });
      },
      onError: () => {
        toast.error("회원 승인에 실패했습니다.");
      },
    },
  });

  const rejectMutation = v2Admin.usePostApiV2AdminRejectId({
    axios: { withCredentials: true },
    mutation: {
      onSuccess: () => {
        toast.success("회원이 거절되었습니다.");
        queryClient.invalidateQueries({
          queryKey: v2Admin.getGetApiV2AdminPendingQueryKey(),
        });
      },
      onError: () => {
        toast.error("회원 거절에 실패했습니다.");
      },
    },
  });

  return (
    <div key={admin.id} className="flex flex-row justify-between items-center">
      <div className="flex flex-col p-2 gap-2 justify-between">
        <div className="flex-1 flex gap-1 items-center">
          <Badge theme="blue">{getApprovalStatus(admin.status)}</Badge>
          <p>{format(admin.createdAt, "yyyy-MM-dd HH:mm")}</p>
        </div>
        <p className="font-semibold">{admin.email}</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            approvMutation.mutate({
              id: admin.id,
            });
          }}
        >
          승인
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            rejectMutation.mutate({
              id: admin.id,
            });
          }}
        >
          거절
        </Button>
      </div>
    </div>
  );
};
