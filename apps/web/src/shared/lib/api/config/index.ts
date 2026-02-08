import axios from "axios";

const getBaseURL = () => {
  // 서버 사이드에서는 항상 프로덕션 API URL 사용 (개발 환경에서도 실제 API 서버로 요청)
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      console.log("[API Config] SSR mode - using production API URL");
    }
    return "https://uosjudo.com";
  }

  // 클라이언트 사이드에서는 항상 상대 경로 사용 (CORS 방지)
  // 로컬 개발 환경과 프로덕션 모두 프록시를 통해 /api로 요청
  return "";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, redirect to admin login
    if (error.response?.status === 401) {
      // Only redirect if we're in a browser context and on an admin page
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin")
      ) {
        console.warn("[Auth] Unauthorized - redirecting to login");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

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
