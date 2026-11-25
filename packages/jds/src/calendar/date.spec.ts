import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampDate,
  compareDate,
  daysInMonth,
  firstWeekdayOfMonth,
  formatDate,
  isDateInRange,
  isSameDate,
  joinDateTime,
  parseDate,
  timePart,
  todayOf,
} from "./date";

describe("parseDate", () => {
  it("YYYY-MM-DD 를 읽는다", () => {
    expect(parseDate("2026-11-25")).toEqual({ year: 2026, month: 11, day: 25 });
  });

  it("시간이 붙어 있어도 날짜만 읽는다 (datetime-local 값)", () => {
    expect(parseDate("2026-11-25T09:30")).toEqual({
      year: 2026,
      month: 11,
      day: 25,
    });
  });

  it("빈 값·모양이 다른 값은 null", () => {
    for (const value of [
      "",
      null,
      undefined,
      "2026-11",
      "26-11-25",
      "2026/11/25",
    ]) {
      expect(parseDate(value)).toBeNull();
    }
  });

  it("달에 없는 날은 null — 문자열만 맞다고 통과시키지 않는다", () => {
    expect(parseDate("2026-02-30")).toBeNull();
    expect(parseDate("2026-13-01")).toBeNull();
    expect(parseDate("2026-00-10")).toBeNull();
  });

  it("윤년 2월 29일은 윤년에만 통과한다", () => {
    expect(parseDate("2028-02-29")).toEqual({ year: 2028, month: 2, day: 29 });
    expect(parseDate("2026-02-29")).toBeNull();
  });

  /**
   * `new Date("2026-11-25")` 는 UTC 자정으로 파싱돼 KST 에서 24일로 보인다.
   * 이 함수는 문자열을 직접 자르므로 시간대에 흔들리지 않아야 한다.
   */
  it("시간대에 흔들리지 않는다", () => {
    expect(formatDate(parseDate("2026-01-01")!)).toBe("2026-01-01");
    expect(formatDate(parseDate("2026-12-31")!)).toBe("2026-12-31");
  });
});

describe("daysInMonth · firstWeekdayOfMonth", () => {
  it("달마다 날수가 맞다", () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 12)).toBe(31);
  });

  it("1900 년은 윤년이 아니고 2000 년은 윤년이다", () => {
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });

  it("1일의 요일을 0=일 기준으로 준다", () => {
    // 2026-11-01 은 일요일
    expect(firstWeekdayOfMonth(2026, 11)).toBe(0);
    // 2026-12-01 은 화요일
    expect(firstWeekdayOfMonth(2026, 12)).toBe(2);
  });
});

describe("addDays", () => {
  it("달과 해를 넘어간다", () => {
    expect(addDays({ year: 2026, month: 11, day: 30 }, 1)).toEqual({
      year: 2026,
      month: 12,
      day: 1,
    });
    expect(addDays({ year: 2026, month: 12, day: 31 }, 1)).toEqual({
      year: 2027,
      month: 1,
      day: 1,
    });
    expect(addDays({ year: 2026, month: 1, day: 1 }, -1)).toEqual({
      year: 2025,
      month: 12,
      day: 31,
    });
  });

  it("윤일을 건너뛰지 않는다", () => {
    expect(addDays({ year: 2028, month: 2, day: 28 }, 1)).toEqual({
      year: 2028,
      month: 2,
      day: 29,
    });
  });
});

describe("addMonths", () => {
  it("넘어간 달에 그 날이 없으면 말일로 떨어진다", () => {
    expect(addMonths({ year: 2026, month: 1, day: 31 }, 1)).toEqual({
      year: 2026,
      month: 2,
      day: 28,
    });
    expect(addMonths({ year: 2026, month: 3, day: 31 }, -1)).toEqual({
      year: 2026,
      month: 2,
      day: 28,
    });
  });

  it("해를 넘어간다 (음수도)", () => {
    expect(addMonths({ year: 2026, month: 12, day: 15 }, 1)).toEqual({
      year: 2027,
      month: 1,
      day: 15,
    });
    expect(addMonths({ year: 2026, month: 1, day: 15 }, -1)).toEqual({
      year: 2025,
      month: 12,
      day: 15,
    });
    expect(addMonths({ year: 2026, month: 5, day: 10 }, -17)).toEqual({
      year: 2024,
      month: 12,
      day: 10,
    });
  });
});

describe("compareDate · isSameDate", () => {
  it("연·월·일 순으로 비교한다", () => {
    expect(
      compareDate(
        { year: 2026, month: 1, day: 2 },
        { year: 2026, month: 1, day: 1 },
      ),
    ).toBeGreaterThan(0);
    expect(
      compareDate(
        { year: 2025, month: 12, day: 31 },
        { year: 2026, month: 1, day: 1 },
      ),
    ).toBeLessThan(0);
    expect(
      compareDate(
        { year: 2026, month: 1, day: 1 },
        { year: 2026, month: 1, day: 1 },
      ),
    ).toBe(0);
  });

  it("isSameDate 는 null 을 같다고 하지 않는다", () => {
    expect(isSameDate(null, null)).toBe(false);
    expect(isSameDate({ year: 2026, month: 1, day: 1 }, null)).toBe(false);
  });
});

describe("clampDate · isDateInRange", () => {
  const min = { year: 2026, month: 11, day: 10 };
  const max = { year: 2026, month: 11, day: 20 };

  it("범위 밖은 가까운 끝으로 당긴다", () => {
    expect(clampDate({ year: 2026, month: 11, day: 1 }, min, max)).toEqual(min);
    expect(clampDate({ year: 2026, month: 11, day: 30 }, min, max)).toEqual(
      max,
    );
    expect(clampDate({ year: 2026, month: 11, day: 15 }, min, max)).toEqual({
      year: 2026,
      month: 11,
      day: 15,
    });
  });

  it("한쪽만 있어도 된다", () => {
    expect(clampDate({ year: 2020, month: 1, day: 1 }, min, null)).toEqual(min);
    expect(clampDate({ year: 2030, month: 1, day: 1 }, null, max)).toEqual(max);
  });

  it("경계는 범위에 든다", () => {
    expect(isDateInRange(min, min, max)).toBe(true);
    expect(isDateInRange(max, min, max)).toBe(true);
    expect(isDateInRange({ year: 2026, month: 11, day: 9 }, min, max)).toBe(
      false,
    );
    expect(isDateInRange({ year: 2026, month: 11, day: 21 }, min, max)).toBe(
      false,
    );
  });
});

describe("buildMonthGrid", () => {
  it("언제나 6주(42칸)를 준다 — 달을 넘겨도 높이가 들썩이지 않는다", () => {
    for (const [year, month] of [
      [2026, 11],
      [2026, 2],
      [2028, 2],
      [2026, 8],
    ] as const) {
      expect(buildMonthGrid(year, month)).toHaveLength(42);
    }
  });

  it("첫 칸은 그 달 1일이 있는 주의 일요일이다", () => {
    // 2026-11-01 이 일요일이라 앞 달 날짜가 끼지 않는다
    expect(buildMonthGrid(2026, 11)[0]).toEqual({
      year: 2026,
      month: 11,
      day: 1,
    });
    // 2026-12-01 은 화요일 → 앞의 일·월은 11월 29·30일
    expect(buildMonthGrid(2026, 12)[0]).toEqual({
      year: 2026,
      month: 11,
      day: 29,
    });
  });

  it("칸이 하루씩 이어진다 (빈칸·중복 없음)", () => {
    const grid = buildMonthGrid(2026, 2);

    for (let index = 1; index < grid.length; index += 1) {
      expect(grid[index]).toEqual(addDays(grid[index - 1]!, 1));
    }
  });

  it("그 달의 모든 날이 들어 있다", () => {
    const days = buildMonthGrid(2028, 2)
      .filter((date) => date.year === 2028 && date.month === 2)
      .map((date) => date.day);

    expect(days).toEqual(Array.from({ length: 29 }, (_, i) => i + 1));
  });
});

describe("todayOf", () => {
  it("로컬 기준 연·월·일을 준다 (UTC 로 밀리지 않는다)", () => {
    // 로컬 자정 직후 — UTC 로 바꾸면 전날이 되는 시각
    expect(todayOf(new Date(2026, 10, 25, 0, 30))).toEqual({
      year: 2026,
      month: 11,
      day: 25,
    });
  });
});

describe("timePart · joinDateTime", () => {
  it("시간만 뗀다", () => {
    expect(timePart("2026-11-25T09:30")).toBe("09:30");
    expect(timePart("2026-11-25")).toBe("");
    expect(timePart(null)).toBe("");
  });

  it("native datetime-local 과 같은 모양으로 합친다", () => {
    expect(joinDateTime({ year: 2026, month: 11, day: 25 }, "09:30")).toBe(
      "2026-11-25T09:30",
    );
  });

  it("시간이 비면 자정으로 둔다", () => {
    expect(joinDateTime({ year: 2026, month: 11, day: 25 }, "")).toBe(
      "2026-11-25T00:00",
    );
  });
});
