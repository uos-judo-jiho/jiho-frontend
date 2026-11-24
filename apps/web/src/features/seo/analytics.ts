import { SITE } from "@/shared/config/site";

const GA_ID = "G-TLK4ZTXFH0";

const productionHost = new URL(SITE.url).hostname;

/** 통계를 모으는 호스트. 로컬·사설 IP·미리보기 주소는 여기 없으므로 잡히지 않는다 */
const GA_HOSTS = [productionHost, `www.${productionHost}`];

/**
 * Google Analytics 를 운영 도메인에서만 불러오는 인라인 스크립트.
 *
 * 빌드 모드(`import.meta.env.PROD`)로 가르면 로컬에서 운영 빌드를 띄우거나
 * 같은 망의 폰에서 IP 로 열었을 때 방문으로 잡힌다. 그래서 브라우저에서 호스트를 본다.
 * SSR HTML 은 어디서나 같고, 운영이 아니면 googletagmanager 로 요청 자체가 나가지 않는다.
 */
export const gaScript = `if (${JSON.stringify(GA_HOSTS)}.includes(location.hostname)) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };
  gtag("js", new Date());
  gtag("config", "${GA_ID}");
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=${GA_ID}";
  document.head.appendChild(s);
}`;
