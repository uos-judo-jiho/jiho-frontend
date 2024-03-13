import axios from "axios";
import { Constants } from "../../constant/constant";

const axiosInstance = axios.create({
  baseURL: Constants.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
