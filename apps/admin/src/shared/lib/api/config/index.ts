import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:4000/api/v1";

const resolveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      console.log("[API Config] CSR mode - using default API URL");
    }
    return DEFAULT_API_BASE_URL;
  }

  return "";
};

const resolveInternalApiBaseUrl = () => {
  if (import.meta.env.VITE_INTERNAL_API_BASE_URL) {
    return import.meta.env.VITE_INTERNAL_API_BASE_URL;
  }

  return resolveApiBaseUrl();
};

const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
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
  },
);

// _internal API 전용 axios 인스턴스 (서버에서 발급받은 토큰 사용)
const serverInternalToken =
  import.meta.env.VITE_INTERNAL_API_TOKEN || "jiho-internal-2024";

export const internalAxiosInstance = axios.create({
  baseURL: resolveInternalApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Jiho-Internal": serverInternalToken,
  },
});

export default axiosInstance;
