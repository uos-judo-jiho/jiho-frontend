import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "/api/v2/admin" : "https://api.uosjudo.com/api/v2/admin",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://admin.uosjudo.com/login?redirectTo=${returnUrl}`;
    }
    return Promise.reject(error);
  },
);
