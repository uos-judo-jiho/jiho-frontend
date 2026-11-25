import { useEffect, useId, useRef, useState } from "react";

import { Calendar } from "./calendar";
import { formatDate, joinDateTime, parseDate, timePart } from "./date";

export type DatePickerProps = {
  /**
   * native 입력과 같은 모양의 값 — `withTime` 이면 `YYYY-MM-DDTHH:mm`,
   * 아니면 `YYYY-MM-DD`. 빈 문자열은 미선택이다.
   *
   * 모양을 native 와 같게 둔 이유: `type="date"` 를 쓰던 자리에 그대로 끼울 수
   * 있고, 서버로 보내는 값이나 zod 스키마를 고치지 않아도 된다.
   */
  value: string;
  onChange: (value: string) => void;
  /** 시간까지 고른다 (native `datetime-local` 자리) */
  withTime?: boolean;
  /** 고를 수 있는 범위 `YYYY-MM-DD` */
  min?: string | null;
  max?: string | null;
  id?: string;
  /** 주면 같은 이름의 hidden input 을 둬서 native 폼 전송에도 값이 실린다 */
  name?: string;
  disabled?: boolean;
  required?: boolean;
  /** 값이 없을 때 버튼에 보이는 글자 */
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * 날짜(선택적으로 시간)를 고르는 입력.
 *
 * ## 왜 읽기 전용 텍스트 입력이 아니라 버튼인가
 *
 * 입력처럼 보이는데 타이핑이 안 되면 사람들은 고장으로 받아들인다. 버튼은
 * 눌러야 하는 것임이 모양에서 드러나고, 스크린 리더에도 `aria-haspopup`
 * 으로 "열리는 것"이라고 알릴 수 있다. 타이핑으로 날짜를 넣는 기능은 파싱
 * 오류 상태까지 딸려 오므로 넣지 않았다 — 필요해지면 그때 더한다.
 *
 * ## native 입력을 왜 대체하는가
 *
 * `type="date"` 는 브라우저마다 모양과 달력 UI 가 전혀 다르고(특히 Safari 와
 * 모바일), 운영 화면의 다른 입력들과 선·높이·글자가 맞지 않는다. 값의 모양은
 * native 와 똑같이 두어 바꿔 끼우는 비용만 없앴다.
 */
export const DatePicker = ({
  value,
  onChange,
  withTime = false,
  min,
  max,
  id,
  name,
  disabled = false,
  required = false,
  placeholder = withTime ? "날짜·시간 선택" : "날짜 선택",
  className,
  ...aria
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const selected = parseDate(value);
  const time = timePart(value);

  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  // 바깥을 누르면 닫는다. 초점은 되돌리지 않는다 — 다른 곳을 누른 사람의
  // 초점을 빼앗아 오면 그쪽 입력을 시작할 수 없다.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const handleSelect = (nextDate: string) => {
    const parsed = parseDate(nextDate);
    if (!parsed) return;

    onChange(withTime ? joinDateTime(parsed, time) : formatDate(parsed));

    // 시간도 골라야 하면 팝오버를 열어 둔다 — 날짜를 누르자마자 닫히면
    // 시간 입력에 닿을 수 없다.
    if (!withTime) close();
  };

  const handleTimeChange = (nextTime: string) => {
    if (!selected) return;
    onChange(joinDateTime(selected, nextTime));
  };

  return (
    <div
      ref={rootRef}
      className={className ? `jds-datepicker ${className}` : "jds-datepicker"}
      // Esc 는 팝오버 안쪽(달력 버튼·시간 입력)에서도 잡혀야 한다
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          close();
        }
      }}
    >
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="jds-datepicker-trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        aria-required={required || undefined}
        {...aria}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span data-placeholder={!value || undefined}>
          {value ? describe(value, withTime) : placeholder}
        </span>
        <span aria-hidden className="jds-datepicker-icon">
          🗓
        </span>
      </button>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={withTime ? "날짜·시간 선택" : "날짜 선택"}
          className="jds-datepicker-popover"
        >
          <Calendar
            value={value}
            onSelect={handleSelect}
            min={min}
            max={max}
            autoFocus
          />

          {withTime && (
            <div className="jds-datepicker-time">
              <label>
                시간
                <input
                  type="time"
                  value={time}
                  // 날짜를 먼저 골라야 한다 — 시간만 있는 값은 만들 수 없다
                  disabled={!selected}
                  onChange={(event) => handleTimeChange(event.target.value)}
                />
              </label>
              <button
                type="button"
                className="jds-datepicker-done"
                onClick={() => close()}
              >
                완료
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/** 버튼에 보일 글자. "2026년 11월 25일 (수)" 꼴로 읽기 쉽게 쓴다. */
const describe = (value: string, withTime: boolean) => {
  const date = parseDate(value);
  if (!date) return value;

  const weekday =
    WEEKDAY_LABELS[
      new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
    ];
  const label = `${date.year}년 ${date.month}월 ${date.day}일 (${weekday})`;
  const time = timePart(value);

  return withTime && time ? `${label} ${time}` : label;
};
