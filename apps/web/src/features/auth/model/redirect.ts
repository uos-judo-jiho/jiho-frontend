/**
 * 로그인 뒤 돌아갈 경로를 정한다.
 *
 * `redirectTo` 는 쿼리스트링으로 들어오는 값이라 그대로 믿고 이동하면 외부
 * 사이트로 튕겨 보내는 오픈 리다이렉트가 된다. 같은 origin 이 아니면 홈으로
 * 돌리고, 로그인 화면으로 되돌아가는 루프도 막는다.
 *
 * 브라우저에서만 부를 수 있다 (`window.location.origin` 이 필요하다).
 */
export const resolveRedirectPath = (redirectTo: string | undefined) => {
  if (!redirectTo) return "/";

  try {
    // 라우터가 검색 파라미터를 이미 한 번 디코드해 준다. 다만 예전 링크는
    // 값을 한 번 더 encodeURIComponent 해서 넣었으므로("%2Fnews%2F…"),
    // 경로로 안 보이는 값만 한 번 더 풀어 준다.
    const raw = redirectTo.startsWith("/")
      ? redirectTo
      : decodeURIComponent(redirectTo);

    const url = new URL(raw, window.location.origin);

    if (url.origin !== window.location.origin) return "/";
    if (url.pathname === "/login") return "/";

    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
};
