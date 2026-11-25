import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "./calendar";

/** 2026-11-25 (수) 로 "오늘"을 고정한다. */
const NOW = new Date(2026, 10, 25, 12, 0);

const renderCalendar = (
  props: Partial<Parameters<typeof Calendar>[0]> = {},
) => {
  const onSelect = vi.fn();
  render(
    <Calendar value="2026-11-25" onSelect={onSelect} now={NOW} {...props} />,
  );
  return { onSelect };
};

const dayButton = (label: string) =>
  screen.getByRole("button", { name: label });

describe("Calendar", () => {
  it("6주(42칸)를 그리고 달 제목을 보여준다", () => {
    renderCalendar();

    expect(screen.getByRole("grid", { name: "2026년 11월" })).toBeTruthy();
    // 날짜 버튼 42개 + 이전/다음 달 버튼 2개
    expect(screen.getAllByRole("button")).toHaveLength(44);
  });

  it("활성 칸만 탭 순서에 둔다 (grid 패턴)", () => {
    renderCalendar();

    const tabbable = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("tabindex") === "0");

    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveProperty("textContent", "25");
  });

  it("오늘에 aria-current, 선택된 날에 aria-selected 를 준다", () => {
    renderCalendar({ value: "2026-11-10" });

    expect(dayButton("2026년 11월 25일").getAttribute("aria-current")).toBe(
      "date",
    );
    expect(
      dayButton("2026년 11월 10일")
        .closest('[role="gridcell"]')
        ?.getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      dayButton("2026년 11월 25일")
        .closest('[role="gridcell"]')
        ?.getAttribute("aria-selected"),
    ).toBe("false");
  });

  it("날짜를 누르면 YYYY-MM-DD 로 알려준다", async () => {
    const { onSelect } = renderCalendar();

    await userEvent.click(dayButton("2026년 11월 3일"));

    expect(onSelect).toHaveBeenCalledWith("2026-11-03");
  });

  it("방향키로는 선택이 바뀌지 않고 활성 칸만 움직인다", async () => {
    const { onSelect } = renderCalendar();

    dayButton("2026년 11월 25일").focus();
    await userEvent.keyboard("{ArrowRight}{ArrowDown}");

    expect(onSelect).not.toHaveBeenCalled();
    // 25일 → 26일 → 한 주 뒤 = 12월 3일
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "2026년 12월 3일",
    );
  });

  it("Enter 로 활성 칸을 선택한다", async () => {
    const { onSelect } = renderCalendar();

    dayButton("2026년 11월 25일").focus();
    await userEvent.keyboard("{ArrowLeft}{Enter}");

    expect(onSelect).toHaveBeenCalledWith("2026-11-24");
  });

  it("PageUp·PageDown 으로 달을, Shift 와 함께 해를 넘긴다", async () => {
    renderCalendar();

    dayButton("2026년 11월 25일").focus();

    await userEvent.keyboard("{PageDown}");
    expect(screen.getByRole("grid", { name: "2026년 12월" })).toBeTruthy();

    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(screen.getByRole("grid", { name: "2025년 12월" })).toBeTruthy();
  });

  it("Home·End 로 그 주의 일요일·토요일로 간다", async () => {
    renderCalendar();

    dayButton("2026년 11월 25일").focus();

    await userEvent.keyboard("{Home}");
    // 2026-11-25 은 수요일 → 그 주 일요일은 22일
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "2026년 11월 22일",
    );

    await userEvent.keyboard("{End}");
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "2026년 11월 28일",
    );
  });

  it("범위 밖 날짜는 누를 수 없다", () => {
    renderCalendar({
      value: "2026-11-25",
      min: "2026-11-20",
      max: "2026-11-27",
    });

    expect(dayButton("2026년 11월 19일").hasAttribute("disabled")).toBe(true);
    expect(dayButton("2026년 11월 28일").hasAttribute("disabled")).toBe(true);
    // 경계는 고를 수 있다
    expect(dayButton("2026년 11월 20일").hasAttribute("disabled")).toBe(false);
    expect(dayButton("2026년 11월 27일").hasAttribute("disabled")).toBe(false);
  });

  it("고를 날이 없는 달로 가는 화살표는 비활성이다", () => {
    renderCalendar({
      value: "2026-11-25",
      min: "2026-11-01",
      max: "2026-11-30",
    });

    expect(
      screen.getByRole("button", { name: "이전 달" }).hasAttribute("disabled"),
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "다음 달" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("min 이 말일이어도 그 달은 막지 않는다", () => {
    renderCalendar({ value: "2026-11-30", min: "2026-11-30" });

    expect(dayButton("2026년 11월 30일").hasAttribute("disabled")).toBe(false);
  });

  it("방향키가 범위를 넘지 않는다", async () => {
    renderCalendar({
      value: "2026-11-20",
      min: "2026-11-20",
      max: "2026-11-27",
    });

    dayButton("2026년 11월 20일").focus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");

    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "2026년 11월 20일",
    );
  });
});
