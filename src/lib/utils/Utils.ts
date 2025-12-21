import { Constants } from "../constant";
import { AwardType } from "../types/AwardType";

/**
 *
 * @param award AwardsType type.
 * @returns string.
 * 수상이력을 AwardsType type으로 받아서 string으로 포멧팅한다.
 */
export const formatAwardsType = (award: AwardType): string => {
  let result: string = "";

  if (award.gold > 0) {
    result += " 금 ";
    result += award.gold;
  }
  if (award.silver > 0) {
    result += " 은 ";
    result += award.silver;
  }
  if (award.bronze > 0) {
    result += " 동 ";
    result += award.bronze;
  }
  if (award.menGroup > 0) {
    result += " 남자 단체전 ";
    result += award.menGroup;
    result += " 위";
  }
  if (award.womenGroup > 0) {
    result += " 여자 단체전 ";
    result += award.womenGroup;
    result += " 위";
  }
  if (award.group > 0) {
    result += " 혼성 단체전 ";
    result += award.group;
    result += " 위";
  }

  return result;
};

export const getImageFileFromSrc = async (src: string, filename: string) => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], "image" + filename + ".png", {
      type: blob.type,
    });
    return file;
  } catch (error) {
    console.error("Error converting image source to File:", error);
    return null;
  }
};

/**
 * @description File 객체를 받아서 base64 인코딩된 Promise<string> 반환
 */
export const toBase64 = async (file: File): Promise<string> => {
  try {
    const data: string = await new Promise(
      (resolve: (value: string) => void, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      },
    );

    return data;
  } catch (error) {
    console.error(error);
    return "";
  }
};

/**
 * @description 년도 리스트를 반환 2022 ~ 현재 년도까지
 * @returns string[]
 * @example ["2022", "2023", "2024", ...]
 */
export const vaildNewsYearList = () => {
  const yearList = Array.from(
    { length: Number(Constants.LATEST_NEWS_YEAR) - 2021 },
    (_, i) => String(2022 + i),
  );
  return yearList;
};
