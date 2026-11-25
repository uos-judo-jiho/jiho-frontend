import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TECHNIQUE_GROUPS } from "../techniques";
import { TechniqueSelect } from "./technique-select";

const first = TECHNIQUE_GROUPS[0].options[0];

describe("TechniqueSelect", () => {
  // Safari 는 확정하는 Enter 를 조합이 끝난 뒤 keyCode 229 로 보낸다
  it.each([
    ["조합 중", { isComposing: true }],
    ["Safari 의 확정", { keyCode: 229 }],
  ])(
    "한글 %s Enter 로는 고르지 않고, 그다음 Enter 로 고른다",
    async (_, composing) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TechniqueSelect value="" onChange={onChange} />);

      const combobox = screen.getByRole("combobox");
      await user.type(combobox, first.label);

      // false = 기본 동작(폼 제출)이 막혔다
      expect(fireEvent.keyDown(combobox, { key: "Enter", ...composing })).toBe(
        false,
      );
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledExactlyOnceWith(first.value);
    },
  );
});
