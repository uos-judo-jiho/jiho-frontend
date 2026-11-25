import { useEffect, useRef, useState } from "react";

import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampDate,
  compareDate,
  daysInMonth,
  formatDate,
  isDateInRange,
  isSameDate,
  parseDate,
  todayOf,
  type CalendarDate,
} from "./date";

/** 일요일 시작. 달력 머리글과 그리드의 열 순서가 이 배열을 따른다. */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export type CalendarProps = {
  /** 선택된 날짜 `YYYY-MM-DD`. 없으면 미선택 */
  value?: string | null;
  onSelect: (value: string) => void;
  /** 고를 수 있는 범위 `YYYY-MM-DD` */
  min?: string | null;
  max?: string | null;
  /** 오늘 기준. 테스트에서 고정할 때만 넘긴다 */
  now?: Date;
  /** 열릴 때 그리드로 초점을 옮긴다 (팝오버에서 쓴다) */
  autoFocus?: boolean;
  className?: string;
};

/**
 * 날짜를 고르는 달력 한 판.
 *
 * ## 초점을 칸마다 두지 않는다
 *
 * 42개 칸을 모두 탭 순서에 넣으면 달력을 지나가려면 탭을 42번 눌러야 한다.
 * WAI-ARIA 의 grid 패턴대로 **활성 칸 하나만 `tabIndex=0`** 이고 나머지는 -1 이며,
 * 이동은 방향키가 맡는다. 그래서 달력 전체가 탭 한 번으로 들어오고 한 번으로 나간다.
 *
 * ## 활성 칸과 선택된 날짜는 다르다
 *
 * 방향키로 돌아다니는 동안에는 선택이 바뀌지 않는다(활성 칸만 움직인다).
 * Enter·Space 를 눌러야 선택된다 — 키보드로 달을 훑어보다 실수로 값이
 * 바뀌는 일이 없다.
 */
export const Calendar = ({
  value,
  onSelect,
  min,
  max,
  now,
  autoFocus = false,
  className,
}: CalendarProps) => {
  const selected = parseDate(value);
  const minDate = parseDate(min);
  const maxDate = parseDate(max);
  const today = todayOf(now);

  /** 방향키가 움직이는 칸. 선택된 날짜가 있으면 거기서 시작한다 */
  const [active, setActive] = useState<CalendarDate>(() =>
    clampDate(selected ?? today, minDate, maxDate),
  );

  const gridRef = useRef<HTMLDivElement>(null);
  /** 방향키·달 이동으로 활성 칸이 바뀐 뒤에만 초점을 옮긴다 */
  const shouldFocusRef = useRef(autoFocus);

  /** 바깥 값이 바뀐 것을 알아보기 위해 들고 있는 직전 값 */
  const [syncedValue, setSyncedValue] = useState(value);

  // 바깥에서 값이 바뀌면(폼 초기화 등) 활성 칸도 따라간다. 초점은 건드리지 않는다 —
  // 입력 중에 달력이 초점을 빼앗으면 타이핑이 끊긴다.
  //
  // effect 가 아니라 **렌더 중에** 맞춘다. effect 로 하면 한 번 그린 뒤 setState 가
  // 또 한 번의 렌더를 부르는데(화면에는 잠깐 옛 달이 비친다), 이렇게 두면 React 가
  // 커밋하기 전에 다시 렌더해서 중간 상태가 화면에 나가지 않는다.
  // (react.dev 의 "prop 이 바뀔 때 state 조정" 패턴)
  if (value !== syncedValue) {
    setSyncedValue(value);

    const next = parseDate(value);
    if (next) setActive(next);
  }

  useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;

    gridRef.current
      ?.querySelector<HTMLButtonElement>('[data-active="true"]')
      ?.focus();
  }, [active]);

  const moveActive = (next: CalendarDate) => {
    shouldFocusRef.current = true;
    setActive(clampDate(next, minDate, maxDate));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, () => CalendarDate> = {
      ArrowLeft: () => addDays(active, -1),
      ArrowRight: () => addDays(active, 1),
      ArrowUp: () => addDays(active, -7),
      ArrowDown: () => addDays(active, 7),
      // 주의 시작·끝 (일요일 ~ 토요일)
      Home: () => addDays(active, -weekdayOf(active)),
      End: () => addDays(active, 6 - weekdayOf(active)),
      PageUp: () => addMonths(active, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(active, event.shiftKey ? 12 : 1),
    };

    const move = moves[event.key];

    if (move) {
      // 방향키로 페이지가 스크롤되지 않게 한다
      event.preventDefault();
      moveActive(move());
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isDateInRange(active, minDate, maxDate)) onSelect(formatDate(active));
    }
  };

  const grid = buildMonthGrid(active.year, active.month);

  return (
    <div className={className ? `jds-calendar ${className}` : "jds-calendar"}>
      <div className="jds-calendar-header">
        <button
          type="button"
          className="jds-calendar-nav"
          aria-label="이전 달"
          disabled={!canGoToMonth(addMonths(active, -1), minDate, maxDate)}
          onClick={() => moveActive(addMonths(active, -1))}
        >
          <span aria-hidden>‹</span>
        </button>

        {/*
          달을 넘길 때 스크린 리더가 바뀐 달을 읽어 주도록 live region 으로 둔다.
          칸마다 전체 날짜를 label 로 달아 두었지만, 달 이동은 칸 이동이 아니라
          화면 전체가 바뀌는 일이라 따로 알려야 한다.
        */}
        <output className="jds-calendar-title" aria-live="polite">
          {active.year}년 {active.month}월
        </output>

        <button
          type="button"
          className="jds-calendar-nav"
          aria-label="다음 달"
          disabled={!canGoToMonth(addMonths(active, 1), minDate, maxDate)}
          onClick={() => moveActive(addMonths(active, 1))}
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`${active.year}년 ${active.month}월`}
        className="jds-calendar-grid"
        onKeyDown={handleKeyDown}
      >
        <div role="row" className="jds-calendar-week">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              role="columnheader"
              aria-label={`${weekday}요일`}
            >
              {weekday}
            </span>
          ))}
        </div>

        {chunk(grid, 7).map((week) => (
          <div
            role="row"
            className="jds-calendar-week"
            key={formatDate(week[0]!)}
          >
            {week.map((date) => {
              const outside = date.month !== active.month;
              const disabled = !isDateInRange(date, minDate, maxDate);
              const isActive = isSameDate(date, active);

              return (
                <div
                  role="gridcell"
                  aria-selected={isSameDate(date, selected)}
                  key={formatDate(date)}
                >
                  <button
                    type="button"
                    className="jds-calendar-day"
                    // 활성 칸만 탭 순서에 둔다 (grid 패턴)
                    tabIndex={isActive ? 0 : -1}
                    data-active={isActive || undefined}
                    data-selected={isSameDate(date, selected) || undefined}
                    data-outside={outside || undefined}
                    data-today={isSameDate(date, today) || undefined}
                    disabled={disabled}
                    aria-current={isSameDate(date, today) ? "date" : undefined}
                    aria-label={`${date.year}년 ${date.month}월 ${date.day}일`}
                    onClick={() => {
                      setActive(date);
                      onSelect(formatDate(date));
                    }}
                  >
                    {date.day}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const weekdayOf = ({ year, month, day }: CalendarDate) =>
  new Date(Date.UTC(year, month - 1, day)).getUTCDay();

/**
 * 그 달에 고를 수 있는 날이 하나라도 있는지. 범위를 벗어난 달로 가는 화살표는
 * 비활성으로 두어, 눌러도 아무 일이 없는 버튼을 남기지 않는다.
 */
const canGoToMonth = (
  month: CalendarDate,
  min: CalendarDate | null,
  max: CalendarDate | null,
) => {
  const lastDay = daysInMonth(month.year, month.month);

  // 말일이 min 보다 이르면 그 달에는 고를 날이 없다. 28 로 어림잡으면
  // min 이 11월 30일일 때 11월 전체가 막혀 버린다.
  if (min && compareDate({ ...month, day: lastDay }, min) < 0) return false;
  if (max && compareDate({ ...month, day: 1 }, max) > 0) return false;
  return true;
};

const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
