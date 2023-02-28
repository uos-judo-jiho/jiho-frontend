import axios from "axios";
import { Constants } from "../constant/constant";

axios.defaults.withCredentials = true;

axios
  .post(
    Constants.AWS_BASE_URL + "/login",
    {},
    {
      withCredentials: true, // 쿠키 cors 통신 설정
    }
  )
  .then((response) => {
    console.log(response);
  });
