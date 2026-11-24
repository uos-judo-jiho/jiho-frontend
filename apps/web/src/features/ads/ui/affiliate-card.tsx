import type { AdPlacement, AdProduct } from "../model/types";
import { buildAdHref } from "../model/slots";
import { useAdClickLog, useAdImpression } from "../model/use-ad-log";

import { cn } from "@/shared/lib/utils";

type AffiliateCardProps = {
  product: AdProduct;
  placement: AdPlacement;
  boardId?: number;
  className?: string;
};

/**
 * 제휴 상품 한 장.
 *
 * 쿠팡 파트너스가 기본으로 주는 "다이나믹 배너"는 `partners.coupang.com` 의
 * iframe 이라 (1) 클릭을 우리가 집계할 수 없고 (2) `tokens.css` 팔레트를
 * 무시한다. 그래서 블로그용 **상품 링크**만 받아 카드를 직접 그린다.
 *
 * `rel` 에 들어간 값의 뜻:
 * - `sponsored` — 대가를 받는 링크임을 검색엔진에 알린다. 빠뜨리면 제휴 링크가
 *   자연 링크로 취급돼 SEO 패널티 대상이 된다.
 * - `nofollow` — 우리 페이지의 평가가 상품 페이지로 흘러가지 않게 한다.
 * - `noopener noreferrer` — 새 탭이 우리 창을 조작하지 못하게 한다.
 *
 * 내부 이동은 `<Link>` 를 쓰는 규칙(CLAUDE.md)의 예외다. 외부 도메인이므로
 * 라우터가 처리할 수 없고, 반드시 새 탭으로 열어 읽던 글을 잃지 않게 한다.
 */
export const AffiliateCard = ({
  product,
  placement,
  boardId,
  className,
}: AffiliateCardProps) => {
  const target = { placement, productId: product.id, boardId };
  const ref = useAdImpression(target);
  const logClick = useAdClickLog(target);

  return (
    <a
      ref={ref}
      href={buildAdHref(product, placement)}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      onClick={logClick}
      className={cn(
        "group flex items-center gap-4 rounded-sm border border-line bg-surface p-3",
        "transition-colors duration-200 ease-brand hover:border-line-strong",
        className,
      )}
    >
      {/*
        쿠팡이 준 이미지 URL 을 그대로 쓴다 (내려받아 재호스팅하면 정책 위반).
        공통 Image 컴포넌트를 쓰지 않는 이유는 외부 도메인 이미지가 실패했을 때
        깨진 그림 대신 자리만 비우는 쪽이 광고에서는 덜 거슬리기 때문이다.
        크기를 고정해 두어 이미지가 늦게 와도 카드가 밀리지 않는다.
      */}
      <div className="size-16 shrink-0 overflow-hidden rounded-xs bg-surface-subtle">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <span className="jd-clamp-2 text-caption font-medium text-ink">
          {product.name}
        </span>
        {/*
          가격·할인율은 적지 않는다 — 실시간으로 바뀌므로 표기 자체가 파트너스
          정책 위반 소지가 있다. "눌러 주세요" 같은 클릭 유도 문구도 쓰지 않는다.
        */}
        <span className="text-micro text-ink-subtle group-hover:text-ink-muted">
          쿠팡에서 보기
          <span className="sr-only"> (새 탭에서 열림)</span>
        </span>
      </div>
    </a>
  );
};
