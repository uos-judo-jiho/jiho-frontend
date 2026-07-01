import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "/api/v2/admin" : "https://api.uosjudo.com/api/v2/admin",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // 이미 로그인 페이지면 리다이렉트 루프를 만들지 않는다.
      if (window.location.pathname !== "/login") {
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `/login?redirectTo=${returnUrl}`;
      }
    }
    return Promise.reject(error);
  },
);
