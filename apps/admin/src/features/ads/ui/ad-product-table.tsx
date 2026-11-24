import type { v2AdminModel } from "@packages/api/model";
import { toast } from "sonner";

import { openConfirmDialog } from "@/components/common/Modals";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getAdMutationErrorMessage,
  useDeleteAdProduct,
  useUpdateAdProduct,
} from "../api";

type AdProduct = v2AdminModel.AdminAdProduct;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("ko-KR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

type AdProductTableProps = {
  products: AdProduct[];
  onEdit: (product: AdProduct) => void;
};

export const AdProductTable = ({ products, onEdit }: AdProductTableProps) => {
  const update = useUpdateAdProduct();
  const remove = useDeleteAdProduct();

  /**
   * 링크가 죽었을 때 가장 먼저 해야 하는 동작. 삭제가 아니라 비활성이므로
   * 기록이 그대로 남고, 다시 켜면 이어진다.
   */
  const handleToggle = async (product: AdProduct) => {
    try {
      await update.mutateAsync({
        adProductId: product.id,
        data: { isActive: !product.isActive },
      });
      toast.success(
        product.isActive ? "노출을 중단했습니다." : "노출을 시작했습니다.",
      );
    } catch (error) {
      toast.error(getAdMutationErrorMessage(error));
    }
  };

  const handleDelete = async (product: AdProduct) => {
    const confirmed = await openConfirmDialog({
      title: "광고 상품을 삭제할까요?",
      description:
        `"${product.name}" 과 개별 노출·클릭 기록이 함께 지워집니다. 되돌릴 수 없습니다. ` +
        "날짜·구좌·상품별 합계 통계는 남지만, 다시 노출할 가능성이 있으면 삭제하지 말고 '노출 중단'을 쓰세요.",
      confirmText: "삭제",
      destructive: true,
    });

    if (!confirmed) return;

    try {
      await remove.mutateAsync({ adProductId: product.id });
      toast.success("광고 상품을 삭제했습니다.");
    } catch (error) {
      toast.error(getAdMutationErrorMessage(error));
    }
  };

  if (products.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        등록된 광고 상품이 없습니다. 상품을 등록하기 전까지 사이트에는 광고
        구좌가 나타나지 않습니다.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>상품</TableHead>
          <TableHead>구좌 · 상품군</TableHead>
          <TableHead>순서</TableHead>
          <TableHead>게재 기간</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">관리</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="font-medium">{product.name}</span>
                <a
                  href={product.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="max-w-[28rem] truncate text-xs text-neutral-500 underline"
                >
                  {product.linkUrl}
                </a>
              </div>
            </TableCell>
            <TableCell className="text-xs">
              {product.placement}
              <br />
              {product.category}
            </TableCell>
            <TableCell className="tabular-nums">{product.priority}</TableCell>
            <TableCell className="text-xs">
              {formatDate(product.startsAt)} ~ {formatDate(product.endsAt)}
            </TableCell>
            <TableCell>
              <span
                className={
                  product.isActive
                    ? "text-xs font-medium text-green-700"
                    : "text-xs font-medium text-neutral-500"
                }
              >
                {product.isActive ? "노출 중" : "중단"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggle(product)}
                  disabled={update.isPending}
                >
                  {product.isActive ? "노출 중단" : "노출 시작"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(product)}
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product)}
                  disabled={remove.isPending}
                >
                  삭제
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
