import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { RecoilRoot } from "recoil";
import AppRouter from "./routers/AppRouter";

export function render(url: string) {
  return renderToString(
    <RecoilRoot>
      <StaticRouter location={url}>
        <AppRouter />
      </StaticRouter>
    </RecoilRoot>
  );
}
