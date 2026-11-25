/**
 * 달력이 쓰는 날짜 계산. 전부 순수 함수이고 외부 의존이 없다.
 *
 * `Date` 를 쓰면서 **UTC 로 넘어가지 않도록** 연·월·일을 숫자로 들고 다닌다.
 * `new Date("2026-11-25")` 는 UTC 자정으로 파싱돼 KST 에서는 하루 전으로
 * 보이는데(가장 흔한 날짜 버그), 아래 함수들은 문자열을 직접 자르고 조립하므로
 * 그 함정을 비켜간다. 시간대 변환이 필요한 계산은 하나도 없다.
 */

/** 달력이 다루는 날짜. 월은 1–12 (JS 의 0–11 이 아니다). */
export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

/** `YYYY-MM-DD` 또는 `YYYY-MM-DDTHH:mm` 의 날짜 부분만 뗀다. */
const datePart = (value: string) => value.slice(0, 10);

const pad = (value: number) => String(value).padStart(2, "0");

/** `YYYY-MM-DD` 로 쓴다. */
export const formatDate = ({ year, month, day }: CalendarDate) =>
  `${year}-${pad(month)}-${pad(day)}`;

/**
 * `YYYY-MM-DD`(뒤에 시간이 붙어 있어도 된다)를 읽는다.
 * 모양이 아니거나 달에 없는 날(2월 30일 등)이면 null.
 */
export const parseDate = (
  value: string | null | undefined,
): CalendarDate | null => {
  if (!value) return null;

  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart(value));
  if (!matched) return null;

  const [, year, month, day] = matched.map(Number) as [
    number,
    number,
    number,
    number,
  ];

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;

  return { year, month, day };
};

/** 그 달의 날수. 윤년은 2월 29일. */
export const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

/** 그 달 1일의 요일 (0=일 … 6=토). */
export const firstWeekdayOfMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month - 1, 1)).getUTCDay();

/** 같은 날인지. */
export const isSameDate = (a: CalendarDate | null, b: CalendarDate | null) =>
  !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;

/** a 가 b 보다 이르면 음수, 같으면 0, 늦으면 양수. */
export const compareDate = (a: CalendarDate, b: CalendarDate) =>
  a.year - b.year || a.month - b.month || a.day - b.day;

/**
 * 날짜를 옮긴다. 달·해를 넘어가도, 넘어간 달에 그 날이 없어도 알맞게 떨어진다.
 * (1월 31일에서 한 달 뒤 → 2월 28일)
 */
export const addDays = (date: CalendarDate, amount: number): CalendarDate => {
  const moved = new Date(
    Date.UTC(date.year, date.month - 1, date.day + amount),
  );

  return {
    year: moved.getUTCFullYear(),
    month: moved.getUTCMonth() + 1,
    day: moved.getUTCDate(),
  };
};

export const addMonths = (date: CalendarDate, amount: number): CalendarDate => {
  const targetMonthIndex = date.month - 1 + amount;
  const year = date.year + Math.floor(targetMonthIndex / 12);
  const month = (((targetMonthIndex % 12) + 12) % 12) + 1;

  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
};

/** 범위를 벗어나면 가까운 끝으로 당긴다. */
export const clampDate = (
  date: CalendarDate,
  min: CalendarDate | null,
  max: CalendarDate | null,
): CalendarDate => {
  if (min && compareDate(date, min) < 0) return min;
  if (max && compareDate(date, max) > 0) return max;
  return date;
};

export const isDateInRange = (
  date: CalendarDate,
  min: CalendarDate | null,
  max: CalendarDate | null,
) =>
  (!min || compareDate(date, min) >= 0) &&
  (!max || compareDate(date, max) <= 0);

/**
 * 달력 한 판에 그릴 날짜들. 앞뒤 달의 날짜로 6주(42칸)를 꽉 채운다.
 *
 * 칸 수를 달마다 바꾸지 않는 이유: 달을 넘길 때 팝오버 높이가 들썩이면 아래
 * 내용이 밀리고, 키보드로 이동하는 중이면 초점이 화면 밖으로 튄다.
 */
export const buildMonthGrid = (year: number, month: number): CalendarDate[] => {
  const leading = firstWeekdayOfMonth(year, month);
  const firstCell = addDays({ year, month, day: 1 }, -leading);

  return Array.from({ length: 42 }, (_, index) => addDays(firstCell, index));
};

/** 오늘. 테스트에서 기준을 넘길 수 있게 Date 를 받는다. */
export const todayOf = (now: Date = new Date()): CalendarDate => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
});

/** `HH:mm` 만 뗀다. 없으면 빈 문자열. */
export const timePart = (value: string | null | undefined) => {
  if (!value) return "";

  const matched = /T(\d{2}:\d{2})/.exec(value);
  return matched ? matched[1] : "";
};

/** 날짜와 시간을 native `datetime-local` 과 같은 모양으로 합친다. */
export const joinDateTime = (date: CalendarDate, time: string) =>
  `${formatDate(date)}T${time || "00:00"}`;
