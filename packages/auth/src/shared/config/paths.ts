/**
 * 인증 페이지가 사용하는 경로. admin·shorts 모두 동일한 경로에 마운트한다.
 * (두 앱 다 SPA 루트 "/"·"/login"·"/register" 를 공유)
 */
export const AUTH_PATHS = {
  home: "/",
  login: "/login",
  register: "/register",
} as const;
