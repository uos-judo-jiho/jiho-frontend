import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://uosjudo.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
