import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/container";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";
import { SiteFooter } from "@/widgets/site-footer/site-footer";
import { SiteHeader } from "@/widgets/site-header/site-header";

type PageShellProps = {
  children: ReactNode;
  /** overlay 는 히어로 사진 위에 헤더를 투명하게 얹는 홈 전용 모드 */
  headerVariant?: "solid" | "overlay";
  /** false 로 두면 본문 폭 제한 없이 children 이 직접 레이아웃을 잡는다 */
  contained?: boolean;
  width?: "prose" | "page";
  className?: string;
};

/**
 * 헤더 + 본문 + 푸터 껍데기. 이전 DefaultLayout 을 대체한다.
 *
 * DefaultLayout 은 <main> 안에 헤더와 푸터까지 넣고 있었는데, main 은 페이지의
 * 주 콘텐츠만 담아야 하므로 랜드마크 구조를 바로잡았다.
 */
export const PageShell = ({
  children,
  headerVariant = "solid",
  contained = true,
  width = "page",
  className,
}: PageShellProps) => (
  <div className="flex min-h-screen flex-col">
    <SiteHeader variant={headerVariant} />

    <main
      id="main"
      className={cn(
        "flex-1",
        // 고정 헤더 높이만큼 본문을 내린다 (overlay 모드는 히어로가 직접 처리)
        headerVariant === "solid" && "pt-header",
        className,
      )}
    >
      {contained ? (
        <Container width={width} className="py-12 sm:py-16">
          {children}
        </Container>
      ) : (
        children
      )}
    </main>

    <SiteFooter />
    <ScrollToTop />
  </div>
);
