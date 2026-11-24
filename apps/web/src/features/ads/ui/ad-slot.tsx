import { AD_SLOTS, resolveAdProducts } from "../model/slots";
import type { AdPlacement } from "../model/types";
import { AdDisclosure } from "./ad-disclosure";
import { AffiliateCard } from "./affiliate-card";

import { cn } from "@/shared/lib/utils";

type AdSlotProps = {
  placement: AdPlacement;
  /** 게시글 상세 구좌에서 넘긴다 — 어느 글에서 발생한 노출·클릭인지 남는다 */
  boardId?: number;
  className?: string;
};

/**
 * 광고 구좌 하나.
 *
 * 게재 시작(`AD_LAUNCH_AT`) 전이거나 등록된 상품이 없으면 **아무것도 그리지
 * 않는다**. 그래서 이 기능은 먼저 머지해도 화면에 나타나지 않는다.
 *
 * ## 왜 서버에서도 그리는가
 *
 * 처음에는 클라이언트 전용 마운트를 생각했지만, 그러면 하이드레이션 시점에
 * 구좌가 불쑥 생겨 레이아웃이 밀린다(CLS). 노출 집계는 `IntersectionObserver`
 * 로 브라우저에서만 일어나므로 서버 렌더가 노출 수를 오염시키지도 않는다.
 * 남는 위험은 게재 시작 '그 순간' 서버와 브라우저의 시계가 경계를 서로 다르게
 * 넘는 단 한 번의 하이드레이션 불일치뿐이고, 그 대가로 CLS 를 0 으로 둔다.
 *
 * 크롤러에게는 `rel="sponsored nofollow"` 로 광고임을 알린다
 * (`AffiliateCard`).
 */
export const AdSlot = ({ placement, boardId, className }: AdSlotProps) => {
  const products = resolveAdProducts(placement);

  if (products.length === 0) return null;

  return (
    <aside
      // 스크린 리더에서도 광고 영역임이 먼저 읽히도록 이름을 붙인다
      aria-label="제휴 광고"
      className={cn(
        "flex flex-col gap-3 rounded-sm border border-line-subtle bg-paper-sunken p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="jd-eyebrow">{AD_SLOTS[placement].label}</h2>
        <AdDisclosure />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {products.map((product) => (
          <AffiliateCard
            key={product.id}
            product={product}
            placement={placement}
            boardId={boardId}
          />
        ))}
      </div>
    </aside>
  );
};
