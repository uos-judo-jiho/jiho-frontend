import { v2Api } from "@packages/api";
import { useCallback, useEffect, useRef } from "react";

import type { AdLogEvent, AdLogPayload, AdLogTarget } from "./types";

/** 노출로 인정하는 최소 노출 면적 비율. */
const IMPRESSION_RATIO = 0.5;

/** 노출로 인정하는 최소 체류 시간(ms). 스크롤로 스쳐 지난 것은 세지 않는다. */
const IMPRESSION_DWELL_MS = 1000;

/** `--breakpoint-md` 와 같은 값. 기기 구분에만 쓴다. */
const DESKTOP_MIN_WIDTH = 860;

type Gtag = (
  command: "event",
  eventName: string,
  params: Record<string, unknown>,
) => void;

/**
 * GA4 는 `__root.tsx` 가 심은 전역 `gtag` 로 들어간다. 차단기를 쓰는 방문자에게는
 * 없을 수 있으므로 보낼 때마다 존재를 확인한다.
 */
const getGtag = () => (window as unknown as { gtag?: Gtag }).gtag;

/**
 * 광고 노출·클릭 로그 한 건을 보낸다.
 *
 * 집계의 주 저장소는 **우리 API**(`POST /v2/ads/events`)다. GA4 는 원시 데이터를
 * 돌려주지 않아 "어느 글에서 어느 상품이 눌렸나"를 질의할 수 없어서, 그 질문에
 * 답할 수 있는 쪽을 1차로 둔다. GA4 에도 같은 이벤트를 흘려 보내 기존 대시보드의
 * 방문 흐름과 같이 볼 수 있게 한다.
 *
 * 실패를 삼킨다 — 광고 집계가 안 되는 것보다 그 때문에 화면이 깨지는 게 나쁘다.
 *
 * `navigator.sendBeacon` 을 쓰지 않는다: 광고 링크는 `target="_blank"` 로 열려
 * 우리 페이지가 그대로 살아 있으므로 전송 중에 문서가 사라질 일이 없다.
 *
 * 개발 모드에서는 콘솔로만 떨어진다. `console.debug` 는 프로덕션 빌드에서
 * esbuild `pure` 로 제거되므로(`vite.config.ts`) 번들에 남지 않는다.
 */
const sendAdLog = (event: AdLogEvent, target: AdLogTarget) => {
  if (typeof window === "undefined") return;

  const payload: AdLogPayload = {
    ...target,
    event,
    // 쿼리스트링·해시는 버린다. 개인을 식별할 값이 섞여 들어올 통로를 막는다.
    // (서버도 한 번 더 자르므로 여기서 빠뜨려도 저장되지는 않는다)
    path: window.location.pathname,
    viewport: window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`).matches
      ? "desktop"
      : "mobile",
  };

  if (import.meta.env.DEV) {
    console.debug("[ads]", payload);
    return;
  }

  void v2Api
    .createAdEvent({
      adProductId: payload.productId,
      event: event === "ad_click" ? "click" : "impression",
      placement: payload.placement,
      path: payload.path,
      boardId: payload.boardId,
      viewport: payload.viewport,
    })
    .catch(() => {
      // 집계 유실은 받아들인다 — 광고 로그 때문에 화면이 흔들리지 않게 한다
    });

  getGtag()?.("event", event, {
    ad_placement: payload.placement,
    ad_product: payload.productId,
    ad_board_id: payload.boardId,
    ad_viewport: payload.viewport,
    page_path: payload.path,
  });
};

/**
 * 광고 노출 집계.
 *
 * 돌려주는 ref 를 광고 카드에 붙이면, 카드가 절반 이상 1초 넘게 보인 시점에
 * 노출 한 건을 보낸다. 한 번 보낸 뒤에는 관측을 끊으므로 같은 화면에서
 * 스크롤을 오르내려도 중복으로 세지 않는다.
 */
export const useAdImpression = ({
  placement,
  productId,
  boardId,
}: AdLogTarget) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    const element = ref.current;

    if (!element || sent.current) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // 이미 기다리고 있으면 타이머를 다시 걸지 않는다
            timer ??= setTimeout(() => {
              sent.current = true;
              observer.disconnect();
              sendAdLog("ad_impression", { placement, productId, boardId });
            }, IMPRESSION_DWELL_MS);
          } else if (timer !== undefined) {
            // 1초를 채우기 전에 화면에서 벗어났다 — 노출로 세지 않는다
            clearTimeout(timer);
            timer = undefined;
          }
        }
      },
      { threshold: IMPRESSION_RATIO },
    );

    observer.observe(element);

    return () => {
      if (timer !== undefined) clearTimeout(timer);
      observer.disconnect();
    };
  }, [placement, productId, boardId]);

  return ref;
};

/** 광고 클릭 집계. 링크의 기본 동작(새 탭 열기)은 막지 않는다. */
export const useAdClickLog = ({ placement, productId, boardId }: AdLogTarget) =>
  useCallback(
    () => sendAdLog("ad_click", { placement, productId, boardId }),
    [placement, productId, boardId],
  );
