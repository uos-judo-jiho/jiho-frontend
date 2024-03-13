import { Cookies } from "react-cookie";
import axiosInstance from "../config";

const METHOD_URL = "api/admin/pictures/";

/**
 * upload picture
 * @description
 * ```bash
 * curl BASE_URL/api/admin/pictures/${year}
 *  -X POST
 *  -d {
 *   base64Imgs: imgSrcs,
 *  }
 * ```
 */
export const uploadPicture = async (year: string, imgs: string[]) => {
  const cookies = new Cookies();

  try {
    const res = await axiosInstance({
      url: `${METHOD_URL}${year}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
      },
      data: {
        base64Imgs: imgs,
      },
    });
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
