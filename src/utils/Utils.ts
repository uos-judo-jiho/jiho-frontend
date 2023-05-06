import { AwardsType } from "../types/AwardsType";

/** string array에 띄어쓰기를 포함하여 string으로 반환
 * @param stringArray
 * @returns string.
 *
 * 예시] 매개변수 : ["a", "b", "c"]
 * 반환값 : "a b c "
 */
function formatStringArray(stringArray: string[]): string {
  var resultStringArray = stringArray.join(" ");
  return resultStringArray;
}

/**
 *
 * @param award AwardsType type.
 * @returns string.
 * 수상이력을 AwardsType type으로 받아서 string으로 포멧팅한다.
 */
function formaAwardsType(award: AwardsType): string {
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
  }
  if (award.womenGroup > 0) {
    result += " 여자 단체전 ";
    result += award.womenGroup;
  }
  if (award.group > 0) {
    result += " 혼성 단체전 ";
    result += award.group;
  }

  return result;
}

/**
 * @param dateTimeObj
 *
 * 매게변수 예시] Tue Feb 28 2023 19:41:04 GMT+0900 (한국 표준시)
 *
 * 리턴값 예시 2023.02.28.화
 */
function formatDateTime(dateTimeString: string): string {
  var result = dateTimeString;
  result = result.replaceAll(".", "");
  var resultList = result.split(" ");

  return resultList.join("-");
}

export { formatStringArray, formaAwardsType, formatDateTime };
