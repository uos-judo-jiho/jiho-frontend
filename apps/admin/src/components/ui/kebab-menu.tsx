import useClickOutside from "@/shared/hooks/useClickOutside";
import { cn } from "@/shared/lib/utils";
import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";

export interface KebabAction {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface KebabMenuProps {
  actions: KebabAction[];
  label?: string;
  className?: string;
}

/** 점 3개(케밥) 아이콘으로 여는 작은 드롭다운 메뉴. */
export const KebabMenu = ({
  actions,
  label = "추가 작업",
  className,
}: KebabMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  if (actions.length === 0) return null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 min-w-36 overflow-hidden rounded-lg border bg-white py-1 shadow-lg"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                action.onSelect();
              }}
              className={cn(
                "block w-full px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                action.destructive
                  ? "text-red-600 hover:bg-red-50"
                  : "text-neutral-700 hover:bg-neutral-50",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
