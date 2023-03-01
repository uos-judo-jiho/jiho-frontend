import { TAwards } from "../types/TAwards";

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
 * @param award TAwards type.
 * @returns string.
 * 수상이력을 TAwards type으로 받아서 string으로 포멧팅한다.
 */
function formatAwards(award: TAwards): string {
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
function formatDateTimeObject2String(dateTimeObj: Object): string {
  const obj2String = dateTimeObj.toString();
  const arr = obj2String.split(" ");
  const year = arr[3];
  const month = arr[1];
  const day = arr[2];
  const week = arr[0];

  var result: string = year + ".";

  switch (month) {
    case "Jan":
      result += "01";
      break;
    case "Feb":
      result += "02";
      break;
    case "Mar":
      result += "03";
      break;
    case "Apr":
      result += "04";
      break;
    case "May":
      result += "05";
      break;
    case "Jun":
      result += "06";
      break;
    case "Jul":
      result += "07";
      break;
    case "Aug":
      result += "08";
      break;
    case "Sep":
      result += "09";
      break;
    case "Oct":
      result += "10";
      break;
    case "Nov":
      result += "11";
      break;
    case "Dec":
      result += "12";
      break;
    default:
      break;
  }

  result += ".";

  if (parseInt(day) < 10) {
    result = result + "0" + day;
  } else {
    result += day;
  }
  result += ".";

  switch (week) {
    case "Mon":
      result += "월";
      break;
    case "Tue":
      result += "화";
      break;
    case "Wed":
      result += "수";
      break;
    case "Thu":
      result += "목";
      break;
    case "Fri":
      result += "금";
      break;
    case "Sat":
      result += "토";
      break;
    case "Sun":
      result += "일";
      break;
    default:
      break;
  }

  return result;
}

export { formatStringArray, formatAwards, formatDateTimeObject2String };
