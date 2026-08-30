import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/format";

type ContentMetaProps = {
  dateTime?: string;
  author?: string;
  tone?: "default" | "inverse";
  className?: string;
};

/** 날짜 · 작성자 한 줄. 목록과 상세가 같은 서식을 쓰도록 모아 둔다. */
export const ContentMeta = ({
  dateTime,
  author,
  tone = "default",
  className,
}: ContentMetaProps) => {
  const parts = [
    dateTime ? (
      <time key="date" dateTime={dateTime}>
        {formatDate(dateTime)}
      </time>
    ) : null,
    author ? <span key="author">{author}</span> : null,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-micro",
        tone === "default" ? "text-ink-subtle" : "text-on-inverse-muted",
        className,
      )}
    >
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className="text-ink-faint">
              ·
            </span>
          )}
          {part}
        </span>
      ))}
    </p>
  );
};
