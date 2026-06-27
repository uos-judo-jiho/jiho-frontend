import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Textarea } from "./textarea";

const schema = z.object({ memo: z.string() });

const MemoForm = ({
  onSubmit,
}: {
  onSubmit: (data: { memo: string }) => void;
}) => {
  const { register, handleSubmit } = useForm<{ memo: string }>({
    resolver: zodResolver(schema),
    defaultValues: { memo: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea aria-label="메모" {...register("memo")} />
      <button type="submit">저장</button>
    </form>
  );
};

describe("Textarea", () => {
  it("forwards RHF registration to the textarea element", async () => {
    const onSubmit = vi.fn();
    render(<MemoForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole("textbox", { name: "메모" }), {
      target: { value: "기술없음" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { memo: "기술없음" },
        expect.anything(),
      ),
    );
  });
});
