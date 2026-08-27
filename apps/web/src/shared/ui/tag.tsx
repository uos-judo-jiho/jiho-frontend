import { cn } from "@/shared/lib/utils";

type TagProps = {
  children: React.ReactNode;
  tone?: "default" | "inverse";
  className?: string;
};

/** 기사·훈련일지에 붙는 해시태그 칩. */
export const Tag = ({ children, tone = "default", className }: TagProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-micro font-medium whitespace-nowrap",
      tone === "default"
        ? "bg-surface-subtle text-ink-muted"
        : "bg-inverse-surface text-on-inverse-muted",
      className,
    )}
  >
    {children}
  </span>
);
