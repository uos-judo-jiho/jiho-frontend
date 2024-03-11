import axios from "axios";
import { Constants } from "../../constant/constant";
import { Cookies } from "react-cookie";

const methodUrl = "api/admin/pictures/";

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
    const res = await axios.post(
      `${Constants.BASE_URL}${methodUrl}${year}`,
      {
        base64Imgs: imgs,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.get("JSESSIONID")}`,
        },
        withCredentials: true,
      }
    );
    if (res) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
