import { getPostApiV2AdminPicturesYearMutationOptions } from "@packages/api/_generated/v2/admin";

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
    const yearNumber = Number(year);
    if (Number.isNaN(yearNumber)) {
      throw new Error("유효하지 않은 연도입니다.");
    }

    const { mutationFn } = getPostApiV2AdminPicturesYearMutationOptions({
      axios: {
        withCredentials: true,
      },
    });

    await mutationFn({
      year: yearNumber,
      data: {
        base64Imgs: imgs,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
