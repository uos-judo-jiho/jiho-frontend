import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { TagField } from "./tag-field";

const Harness = () => {
  const form = useForm({ defaultValues: { tags: [] as string[] } });
  const tags = useWatch({ control: form.control, name: "tags" });

  return (
    <FormProvider {...form}>
      <TagField />
      <output>{JSON.stringify(tags)}</output>
    </FormProvider>
  );
};

describe("TagField", () => {
  // Safari 는 확정하는 Enter 를 조합이 끝난 뒤 keyCode 229 로 보낸다
  it.each([
    ["조합 중", { isComposing: true }],
    ["Safari 의 확정", { keyCode: 229 }],
  ])(
    "한글 %s Enter 로는 추가되지 않고, 그다음 Enter 로 추가된다",
    async (_, composing) => {
      const user = userEvent.setup();
      render(<Harness />);

      const input = screen.getByPlaceholderText(/태그를 입력하세요/);
      const saved = screen.getByRole("status");
      await user.type(input, "대회");

      // false = 기본 동작(폼 제출)이 막혔다
      expect(fireEvent.keyDown(input, { key: "Enter", ...composing })).toBe(
        false,
      );
      expect(saved).toHaveTextContent("[]");
      expect(input).toHaveValue("대회");

      await user.keyboard("{Enter}");
      expect(saved).toHaveTextContent('["대회"]');
      expect(input).toHaveValue("");
    },
  );
});
