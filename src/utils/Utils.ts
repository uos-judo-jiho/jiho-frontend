/** string array에 띄어쓰기를 포함하여 string으로 반환
 *
 * 예시] 매개변수 : ["a", "b", "c"]
 * 반환값 : "a b c "
 */
export function formatStringArray(stringArray: string[]): string {
  var resultStringArray = stringArray.join(" ");
  return resultStringArray;
}
