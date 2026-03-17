import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import useClickOutside from "./useClickOutside";

const TestComponent = ({ onClick }: { onClick: (event: MouseEvent) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClick);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <div data-testid="outside">Outside</div>
    </div>
  );
};

describe("useClickOutside", () => {
  it("should call onClick when clicking outside", () => {
    const onClick = vi.fn();
    render(<TestComponent onClick={onClick} />);

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when clicking inside", () => {
    const onClick = vi.fn();
    render(<TestComponent onClick={onClick} />);

    fireEvent.mouseDown(screen.getByTestId("inside"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
