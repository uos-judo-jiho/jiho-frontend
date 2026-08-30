/**
 * 로그인 후 돌아갈 경로를 정한다.
 * 외부 origin 이나 로그인/회원가입으로의 되돌기는 홈으로 바꿔 루프를 막는다.
 */
export const resolveRedirectUrl = (redirectTo: string | undefined) => {
  if (!redirectTo) {
    return "/";
  }

  try {
    const url = new URL(redirectTo, window.location.origin);

    if (url.origin !== window.location.origin) {
      return "/";
    }
    if (url.pathname === "/login" || url.pathname === "/register") {
      return "/";
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
};
