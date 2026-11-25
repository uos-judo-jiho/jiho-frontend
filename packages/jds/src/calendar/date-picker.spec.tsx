import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from "./date-picker";

const open = async () => {
  await userEvent.click(screen.getByRole("button", { name: /선택|2026년/ }));
  return screen.getByRole("dialog");
};

describe("DatePicker", () => {
  it("값이 없으면 placeholder 를, 있으면 읽기 쉬운 날짜를 보여준다", () => {
    const { rerender } = render(<DatePicker value="" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "날짜 선택" })).toBeTruthy();

    rerender(<DatePicker value="2026-11-25" onChange={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /2026년 11월 25일 \(수\)/ }),
    ).toBeTruthy();
  });

  it("달력은 눌러야 열린다 — 처음에는 닫혀 있다", async () => {
    render(<DatePicker value="2026-11-25" onChange={vi.fn()} />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await open();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("날짜를 고르면 값을 넘기고 닫는다", async () => {
    const onChange = vi.fn();
    render(<DatePicker value="2026-11-25" onChange={onChange} />);

    await open();
    await userEvent.click(
      screen.getByRole("button", { name: "2026년 11월 3일" }),
    );

    expect(onChange).toHaveBeenCalledWith("2026-11-03");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Esc 로 닫고 초점을 버튼으로 되돌린다", async () => {
    render(<DatePicker value="2026-11-25" onChange={vi.fn()} />);

    const trigger = screen.getByRole("button", { name: /2026년 11월 25일/ });
    await open();
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  describe("withTime", () => {
    it("datetime-local 과 같은 모양으로 값을 만든다", async () => {
      const onChange = vi.fn();
      render(
        <DatePicker withTime value="2026-11-25T09:30" onChange={onChange} />,
      );

      await open();
      await userEvent.click(
        screen.getByRole("button", { name: "2026년 11월 3일" }),
      );

      // 날짜만 바뀌고 시간은 지켜진다
      expect(onChange).toHaveBeenCalledWith("2026-11-03T09:30");
    });

    it("날짜를 골라도 닫지 않는다 — 시간 입력에 닿아야 한다", async () => {
      render(
        <DatePicker withTime value="2026-11-25T09:30" onChange={vi.fn()} />,
      );

      await open();
      await userEvent.click(
        screen.getByRole("button", { name: "2026년 11월 3일" }),
      );

      expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("날짜가 없으면 시간은 고를 수 없다", async () => {
      render(<DatePicker withTime value="" onChange={vi.fn()} />);

      await open();

      expect(screen.getByLabelText("시간").hasAttribute("disabled")).toBe(true);
    });

    it("버튼에 시간까지 보여준다", () => {
      render(
        <DatePicker withTime value="2026-11-25T09:30" onChange={vi.fn()} />,
      );

      expect(
        screen.getByRole("button", { name: /2026년 11월 25일 \(수\) 09:30/ }),
      ).toBeTruthy();
    });
  });

  it("name 을 주면 native 폼 전송용 hidden input 이 생긴다", () => {
    const { container } = render(
      <DatePicker name="dateTime" value="2026-11-25" onChange={vi.fn()} />,
    );

    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden?.getAttribute("name")).toBe("dateTime");
    expect(hidden?.getAttribute("value")).toBe("2026-11-25");
  });
});
