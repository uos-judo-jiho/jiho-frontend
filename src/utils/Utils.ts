import { AwardsType } from "../types/TAwards";

/** string array에 띄어쓰기를 포함하여 string으로 반환
 * @param stringArray
 * @returns string.
 *
 * 예시] 매개변수 : ["a", "b", "c"]
 * 반환값 : "a b c "
 */
export const formatStringArray = (stringArray: string[]): string => {
  var resultStringArray = stringArray.join(" ");
  return resultStringArray;
};

/**
 *
 * @param award AwardsType type.
 * @returns string.
 * 수상이력을 AwardsType type으로 받아서 string으로 포멧팅한다.
 */
export const formaAwardsType = (award: AwardsType): string => {
  let result: string = award.title + " | ";

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

/**
 * @param dateTimeObj
 *
 * 매게변수 예시] Tue Feb 28 2023 19:41:04 GMT+0900 (한국 표준시)
 *
 * 리턴값 예시 2023.02.28.화
 */
export const formatDateTime = (dateTimeString: string): string => {
  var result = dateTimeString;
  result = result.replaceAll(".", "");
  var resultList = result.split(" ");

  return resultList.join("-");
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

export const toBase64 = async (file: File): Promise<string> => {
  try {
    const data: string = await new Promise((resolve: (value: string) => void, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    return data;
  } catch (error) {
    console.error(error);
    return "";
  }
};
