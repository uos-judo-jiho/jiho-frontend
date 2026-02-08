import type { AxiosInstance } from "axios";
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

const attachUnauthorizedInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If 401 Unauthorized, redirect to admin login
      if (error.response?.status === 401) {
        // Only redirect if we're in a browser context and on an admin page
        if (typeof window !== "undefined") {
          console.warn("[Auth] Unauthorized - redirecting to login");
          window.location.href = "/";
        }
      }
      return Promise.reject(error);
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
