import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OverlayProvider } from "overlay-kit";
import { describe, expect, it } from "vitest";
import { openConfirmDialog } from "./ConfirmDialog";

const renderProvider = () => render(<OverlayProvider />);

describe("openConfirmDialog", () => {
  it("확인을 누르면 true 로 resolve 된다", async () => {
    const user = userEvent.setup();
    renderProvider();

    const result = openConfirmDialog({
      title: "게시물 삭제",
      description: "게시물을 삭제할까요?",
      confirmText: "삭제",
      destructive: true,
    });

    await user.click(await screen.findByRole("button", { name: "삭제" }));

    await expect(result).resolves.toBe(true);
  });

  it("취소를 누르면 false 로 resolve 된다", async () => {
    const user = userEvent.setup();
    renderProvider();

    const result = openConfirmDialog({ title: "변경사항 저장" });

    await user.click(await screen.findByRole("button", { name: "취소" }));

    await expect(result).resolves.toBe(false);
  });
});
