// TanStack Start 프로덕션 서버 (Node)
// vite build 산출물(dist/server)의 fetch 핸들러를 srvx 로 서빙하고,
// dist/client 정적 자산을 함께 제공한다.
import { serve } from "srvx/node";
import { staticMiddleware } from "srvx/static";

import server from "./dist/server/server.js";

const port = Number(process.env.PORT || 3000);

serve({
  port,
  middleware: [staticMiddleware({ dir: "./dist/client" })],
  fetch: server.fetch,
});

console.log(`Server started at http://localhost:${port}`);
