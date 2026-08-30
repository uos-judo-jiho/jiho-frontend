import { useEffect } from "react";

import { logger } from "@99mini/logger-client";

import { Container } from "@/shared/ui/container";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";
import {
  HomeHero,
  HomeIdentity,
  HomeLatestNews,
  HomeLatestTrainings,
  HomeNotices,
} from "@/widgets/home";
import { SiteFooter } from "@/widgets/site-footer/site-footer";
import { SiteHeader } from "@/widgets/site-header/site-header";

export const HomePage = () => {
  useEffect(() => {
    logger.info("홈", { path: window.location.pathname });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 히어로 사진 위에 헤더를 얹었다가 스크롤하면 불투명해진다 */}
      <SiteHeader variant="overlay" />

      <main id="main" className="flex-1">
        <HomeHero />

        <Container className="flex flex-col gap-section py-section">
          <HomeIdentity />
          <HomeLatestNews />
          <HomeLatestTrainings />
          <HomeNotices />
        </Container>
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
};
