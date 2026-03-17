import React, { useRef } from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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
    const { getByTestId } = render(<TestComponent onClick={onClick} />);

    fireEvent.mouseDown(getByTestId("outside"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when clicking inside", () => {
    const onClick = vi.fn();
    const { getByTestId } = render(<TestComponent onClick={onClick} />);

    fireEvent.mouseDown(getByTestId("inside"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
