import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/app/index.css";

import StandaloneApp from "@/app/StandaloneApp";

// dev: orval 생성 클라이언트가 하드코딩한 절대 URL(https://api.uosjudo.com)을
// 상대경로로 바꿔 Vite dev 프록시(/api)를 타게 한다 → 동일 출처가 되어 쿠키 인증 동작.
if (import.meta.env.DEV) {
  axios.interceptors.request.use((config) => {
    if (config.url) {
      config.url = config.url.replace(/^https?:\/\/api\.uosjudo\.com/i, "");
    }
    return config;
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element for admin app");
}

createRoot(rootElement).render(
  <StrictMode>
    <StandaloneApp />
  </StrictMode>,
);
