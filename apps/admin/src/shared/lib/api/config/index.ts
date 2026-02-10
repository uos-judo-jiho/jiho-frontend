import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:4000/api/v2";

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

const resolveApiOrigin = () => {
  const apiBaseUrl = resolveApiBaseUrl();
  if (!apiBaseUrl) {
    return "";
  }

  const originFallback =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";

  try {
    return new URL(apiBaseUrl, originFallback).origin;
  } catch {
    return "";
  }
};

type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<boolean> | null = null;

const resolveRefreshUrl = () => {
  const apiOrigin = resolveApiOrigin();
  if (apiOrigin) {
    return `${apiOrigin}/api/v2/admin/refresh`;
  }

  return "/api/v2/admin/refresh";
};

const refreshSession = async () => {
  try {
    await axios.post(resolveRefreshUrl(), undefined, {
      withCredentials: true,
    });

    return true;
  } catch (error) {
    return false;
  }
};

const attachUnauthorizedInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      const requestUrl = originalRequest.url ?? "";
      const isRefreshRequest =
        typeof requestUrl === "string" &&
        requestUrl.includes("/api/v2/admin/refresh");
      const isMeRequest =
        typeof requestUrl === "string" &&
        requestUrl.includes("/api/v2/admin/me");
      const shouldRedirect = !isMeRequest;

      if (isRefreshRequest || originalRequest._retry) {
        if (typeof window !== "undefined" && shouldRedirect) {
          console.warn("[Auth] Unauthorized - redirecting to login");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshed = await refreshPromise;
      if (!refreshed) {
        if (typeof window !== "undefined" && shouldRedirect) {
          console.warn("[Auth] Refresh failed - redirecting to login");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }

      return axios.request(originalRequest);
    },
  );
};

const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

attachUnauthorizedInterceptor(axiosInstance);

axios.defaults.withCredentials = true;
attachUnauthorizedInterceptor(axios);

const apiOrigin = resolveApiOrigin();
if (apiOrigin) {
  axios.interceptors.request.use((config) => {
    if (typeof config.url === "string" && config.url.startsWith("http")) {
      const url = new URL(config.url);
      config.url = `${apiOrigin}${url.pathname}${url.search}`;
    }
    return config;
  });
}

export default axiosInstance;
