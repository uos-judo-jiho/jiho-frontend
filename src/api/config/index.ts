import axios from "axios";

import { Constants } from "@/lib/constant";

const getBaseURL = () => {
  // 서버 사이드에서는 항상 프로덕션 API URL 사용 (개발 환경에서도 실제 API 서버로 요청)
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      console.log("[API Config] SSR mode - using production API URL");
    }
    return "https://uosjudo.com";
  }

  // 클라이언트 사이드에서만 hostname 체크
  const hostname = window.location.hostname;

  // 로컬 개발 환경 (localhost, 127.0.0.1) - 프록시 사용
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "";
  }

  // Docker 환경에서 내부 네트워크 체크 (환경변수 활용)
  if (
    process.env.NODE_ENV === "development" ||
    process.env.VITE_USE_PROXY === "true"
  ) {
    return "";
  }

  // 프로덕션 환경
  return Constants.BASE_URL;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// _internal API 전용 axios 인스턴스 (서버에서 발급받은 토큰 사용)
const serverInternalToken =
  import.meta.env.VITE_INTERNAL_API_TOKEN || "jiho-internal-2024";

export const internalAxiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Jiho-Internal": serverInternalToken,
  },
});

export default axiosInstance;
