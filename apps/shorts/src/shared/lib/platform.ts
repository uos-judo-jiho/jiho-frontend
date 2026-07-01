/**
 * PWA 설치 안내를 위한 플랫폼/브라우저 감지.
 * 브라우저별로 홈 화면 추가(설치) 방식이 달라 안내 문구를 분기한다.
 */
export type InstallPlatform =
  | "ios-safari" // iOS Safari — 공유 → 홈 화면에 추가
  | "ios-other" // iOS 크롬/기타 — Safari로 열도록 안내
  | "android-chrome" // Android Chrome — 메뉴 → 앱 설치
  | "samsung" // 삼성 인터넷 — 메뉴 → 현재 페이지 추가 → 홈 화면
  | "inapp" // 네이버/카카오 등 인앱 브라우저 — 설치 불가, 브라우저로 열기 안내
  | "desktop" // 데스크톱 브라우저
  | "unknown";

/** 이미 홈 화면 앱(standalone)으로 실행 중인지. 이 경우 설치 유도를 숨긴다. */
export const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  const iosStandalone = (
    window.navigator as unknown as { standalone?: boolean }
  ).standalone;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    iosStandalone === true
  );
};

export const detectPlatform = (): InstallPlatform => {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;

  // iPadOS 13+ 는 데스크톱 Safari로 위장하므로 터치 포인트로 보정.
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);

  // 인앱 브라우저 — 네이버앱(NAVER(inapp;…)), 카카오톡, 페이스북/인스타/라인.
  const isInApp =
    /NAVER\(inapp/i.test(ua) ||
    /KAKAOTALK/i.test(ua) ||
    /DaumApps/i.test(ua) ||
    /FBAN|FBAV|FB_IAB|Instagram|Line\//i.test(ua);
  if (isInApp) return "inapp";

  if (isIOS) {
    // iOS는 WebKit(Safari 엔진)에서만 홈 화면 추가가 가능. 크롬/파폭 등은 Safari 안내.
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|naver/i.test(ua);
    return isSafari ? "ios-safari" : "ios-other";
  }

  if (/SamsungBrowser/i.test(ua)) return "samsung";
  if (isAndroid) return "android-chrome";
  return "desktop";
};
