import type { Award } from "@/shared/lib/types/content";
import { awardMedals } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type AwardListProps = {
  awards: Award[];
  tone?: "default" | "inverse";
  /** 좁은 화면에서 보여줄 최대 개수 (넘치면 접는다) */
  limitOnMobile?: number;
  className?: string;
};

/**
 * 수상 이력 목록.
 * 메달 종류별로 칩을 나눠 그려서, 이전처럼 " 금 3 은 1 " 같은 한 덩어리
 * 문자열이 아니라 눈으로 훑을 수 있게 했다.
 */
export const AwardList = ({
  awards,
  tone = "default",
  limitOnMobile,
  className,
}: AwardListProps) => (
  <ul className={cn("flex flex-col", className)}>
    {awards.map((award, index) => {
      const medals = awardMedals(award);
      const hiddenOnMobile =
        limitOnMobile !== undefined && index >= limitOnMobile;

      return (
        <li
          key={award.id ?? award.title}
          className={cn(
            "flex flex-col gap-2 border-t py-4 first:border-t-0 first:pt-0",
            tone === "default" ? "border-line" : "border-inverse-line",
            hiddenOnMobile && "hidden md:flex",
          )}
        >
          <p
            className={cn(
              "text-caption font-semibold",
              tone === "default" ? "text-ink-strong" : "text-on-inverse",
            )}
          >
            {award.title}
          </p>
          {medals.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 gap-y-1">
              {medals.map((medal) => (
                <li
                  key={medal.label}
                  className={cn(
                    "flex items-baseline gap-1 text-micro",
                    tone === "default"
                      ? "text-ink-muted"
                      : "text-on-inverse-muted",
                  )}
                >
                  <span>{medal.label}</span>
                  <span
                    data-numeric
                    className={cn(
                      "font-bold tabular-nums",
                      tone === "default" ? "text-accent-strong" : "text-accent",
                    )}
                  >
                    {medal.count}
                  </span>
                  {medal.suffix ? <span>{medal.suffix}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    })}
  </ul>
);
