import axios from "axios";

import { Constants } from "@/lib/constant";

const getBaseURL = () => {
  // 서버 사이드에서는 항상 풀 URL 사용
  if (typeof window === 'undefined') {
    return Constants.BASE_URL;
  }

  // 클라이언트 사이드에서만 hostname 체크
  const hostname = window.location.hostname;

  // 로컬 개발 환경 (localhost, 127.0.0.1)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return "";
  }

  // Docker 환경에서 내부 네트워크 체크 (환경변수 활용)
  if (process.env.NODE_ENV === 'development' || process.env.VITE_USE_PROXY === 'true') {
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

export default axiosInstance;
