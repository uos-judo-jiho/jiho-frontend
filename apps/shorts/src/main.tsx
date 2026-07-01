import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/app/app";

// dev: @packages/auth 의 orval 훅이 하드코딩한 절대 URL(https://api.uosjudo.com)을
// 상대경로로 바꿔 Vite dev 프록시(/api)를 타게 한다 → 동일 출처가 되어 쿠키 인증 동작.
if (import.meta.env.DEV) {
  axios.interceptors.request.use((config) => {
    if (config.url) {
      config.url = config.url.replace(/^https?:\/\/api\.uosjudo\.com/i, "");
    }
    return config;
  });
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
