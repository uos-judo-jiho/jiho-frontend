import { createFileRoute } from "@tanstack/react-router";

import { getBackendBaseUrl, serverConsole } from "@/server/config";

/**
 * 백엔드 API 프록시 (기존 express server/index.ts 의 /api 미들웨어 이식).
 * dev/prod 동일하게 server route 가 처리한다.
 */
const proxyApiRequest = async (request: Request, splat: string) => {
  try {
    const backendBaseUrl = getBackendBaseUrl();
    const requestUrl = new URL(request.url);

    const targetUrl = `${backendBaseUrl}/api/${splat}${requestUrl.search}`;

    serverConsole.info(`[${request.method}] ${targetUrl}`);

    const bodyText = ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.text();
    const hasBody = !!bodyText && bodyText.length > 0;

    const authorization = request.headers.get("authorization");
    const cookie = request.headers.get("cookie");

    const response = await fetch(targetUrl, {
      method: request.method,
      redirect: "manual",
      headers: {
        // 본문 없는 POST(logout/refresh 등)에 Content-Type 을 붙이면
        // Fastify 가 "빈 본문"으로 거부하므로 본문이 있을 때만 전달한다.
        ...(hasBody && {
          "Content-Type":
            request.headers.get("content-type") || "application/json",
        }),
        "User-Agent": request.headers.get("user-agent") || "proxy",
        ...(authorization && { Authorization: authorization }),
        ...(cookie && { Cookie: cookie }),
      },
      body: hasBody ? bodyText : undefined,
    });

    const data = await response.text();

    // Convert 302 redirects to 401 for CORS compatibility
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get("location");
      if (location?.includes("/admin") || location?.includes("/login")) {
        return Response.json(
          {
            error: "Unauthorized",
            message: "Authentication required",
            redirectTo: location,
          },
          { status: 401, headers: { "X-Robots-Tag": "noindex, nofollow" } },
        );
      }
    }

    const headers = new Headers({ "X-Robots-Tag": "noindex, nofollow" });

    const contentType = response.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    // Set-Cookie 전달 (인증에 필수)
    const setCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [response.headers.get("set-cookie")].filter(
            (v): v is string => !!v,
          );
    for (const value of setCookies) {
      headers.append("Set-Cookie", value);
    }

    return new Response(data, { status: response.status, headers });
  } catch (error) {
    serverConsole.error("Proxy error:", error);
    return Response.json({ error: "Proxy error" }, { status: 500 });
  }
};

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: ({ request, params }) => proxyApiRequest(request, params._splat ?? ""),
    },
  },
});
