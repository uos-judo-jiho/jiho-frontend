import type { v2AdminModel } from "@packages/api/model";
import { useState } from "react";

import { AdProductForm, AdProductTable, useAdProducts } from "@/features/ads";

type AdProduct = v2AdminModel.AdminAdProduct;

/**
 * 제휴 광고(쿠팡 파트너스) 상품 관리. root 전용 화면이다.
 *
 * 수수료 수익과 표시 의무가 걸린 데이터라 게시글 작성 권한과 같은 선에 두지
 * 않는다. 라우트의 `requireRole` 과 서버의 `requireRole(["root"])` 가 같은
 * 조건으로 두 번 막는다.
 */
export const AdsPage = () => {
  const { data: products, isLoading, isError } = useAdProducts();
  const [editing, setEditing] = useState<AdProduct | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">제휴 광고 상품</h1>
        <p className="text-sm text-neutral-600">
          지호지 기사와 훈련일지의 글 하단에 보이는 쿠팡 파트너스 상품을
          관리합니다. 등록된 상품이 없으면 사이트에 광고 구좌가 나타나지 않고,
          공지한 시행일 (2026-12-01) 전에도 노출되지 않습니다.
        </p>
        <ul className="list-disc pl-5 text-xs text-neutral-500">
          <li>상품 링크는 쿠팡 파트너스의 '블로그용 링크'만 등록됩니다.</li>
          <li>
            상품명에 가격·할인율을 넣지 않습니다. 쿠팡 가격은 실시간으로
            바뀌어서 적어 두는 것 자체가 정책 위반 소지가 있습니다.
          </li>
          <li>
            체중 감량 보조제, 주류·도박, 효능 표현이 필요한 의약외품은 올리지
            않습니다.
          </li>
          <li>
            링크가 죽었으면 삭제보다 <b>노출 중단</b>을 쓰세요 — 그동안의
            노출·클릭 기록이 남습니다.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          {editing ? `"${editing.name}" 수정` : "새 상품 등록"}
        </h2>
        <AdProductForm
          // 수정 대상이 바뀌면 폼 내부 상태를 새로 잡아야 한다
          key={editing?.id ?? "new"}
          product={editing ?? undefined}
          onDone={() => setEditing(null)}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">등록된 상품</h2>
        {isLoading && <p className="text-sm text-neutral-500">불러오는 중…</p>}
        {isError && (
          <p className="text-sm text-red-600">
            광고 상품을 불러오지 못했습니다. 권한(root)과 로그인 상태를 확인해
            주세요.
          </p>
        )}
        {products && <AdProductTable products={products} onEdit={setEditing} />}
      </section>
    </div>
  );
};
