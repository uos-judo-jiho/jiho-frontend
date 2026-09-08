import { Link, linkOptions } from "@tanstack/react-router";

import type { ContentSummary } from "@/shared/lib/types/content";
import { formatDate } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image";

type TrainingCardProps = {
  training: ContentSummary;
  priority?: boolean;
  className?: string;
};

/**
 * 훈련일지 그리드 한 칸.
 *
 * 훈련일지는 제목보다 "언제 찍힌 사진인가"가 중요하므로 사진을 꽉 채우고
 * 날짜만 얹는다. 이전 ThumbnailCard 는 오버레이가 sm 이상에서만 나타나
 * 모바일에서는 날짜를 볼 방법이 아예 없었다.
 */
export const TrainingCard = ({
  training,
  priority = false,
  className,
}: TrainingCardProps) => {
  const cover = training.thumbnail;
  const label = `훈련일지 ${formatDate(training.dateTime)}`;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-sm bg-surface-subtle",
        className,
      )}
    >
      {cover && (
        <Image
          src={cover.originSrc}
          lowResSrc={cover.smallSrc}
          alt={label}
          aspect="square"
          priority={priority}
          imageClassName="transition-transform duration-500 ease-brand group-hover:scale-[1.05]"
        />
      )}

      <div className="jd-scrim pointer-events-none absolute inset-x-0 bottom-0 flex items-end p-3 sm:p-4">
        <p className="text-caption font-semibold text-on-inverse">
          <time dateTime={training.dateTime}>
            {formatDate(training.dateTime)}
          </time>
        </p>
      </div>

      <Link
        {...linkOptions({
          to: "/photo/$id",
          params: { id: String(training.id) },
        })}
        className="jd-stretch-link"
      >
        <span className="sr-only">{label}</span>
      </Link>
    </article>
  );
};
