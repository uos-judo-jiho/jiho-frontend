export function formatStringArray(stringArray: string[]): string[] {
  var resultStringArray = [];
  resultStringArray = stringArray.map((item) => item + " ");
  return resultStringArray;
}
