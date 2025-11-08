import axiosInstance from "../config";

const METHOD_URL = "/api/admin/pictures/";

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
  try {
    const res = await axiosInstance({
      url: `${METHOD_URL}${year}`,
      method: "POST",
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
