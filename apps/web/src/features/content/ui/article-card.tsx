import { Link, type LinkOptions } from "@tanstack/react-router";

import type { ContentItem } from "@/shared/lib/types/content";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image";
import { Tag } from "@/shared/ui/tag";
import { ContentMeta } from "./content-meta";

type ArticleCardProps = {
  item: ContentItem;
  /** linkOptions() 로 만들어 라우트가 컴파일 타임에 검증된 링크 */
  link: LinkOptions;
  /** featured 는 목록 첫 항목을 크게 보여줄 때 쓴다 */
  variant?: "default" | "featured";
  /** 첫 화면에 보이는 카드는 이미지를 즉시 로드한다 */
  priority?: boolean;
  className?: string;
};

/**
 * 지호지 기사·훈련일지 목록의 카드 한 장.
 *
 * 이전 NewsCard 는 (1) `<picture>` 안에서 `<source>` 를 `<img>` **뒤에** 두어
 * 아트디렉션이 전혀 적용되지 않았고 (2) 로드 감지용 숨은 `<img>` 때문에 원본을
 * 두 번 받았으며 (3) 제목 마크업을 xs/sm 용으로 두 벌 렌더했다.
 * 여기서는 사진 한 장, 제목 한 벌만 그린다.
 */
export const ArticleCard = ({
  item,
  link,
  variant = "default",
  priority = false,
  className,
}: ArticleCardProps) => {
  const cover = item.images[0];
  const featured = variant === "featured";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4",
        featured && "sm:gap-6",
        className,
      )}
    >
      {cover ? (
        <div className="overflow-hidden rounded-sm bg-surface-subtle">
          <Image
            src={cover.originSrc}
            lowResSrc={cover.smallSrc}
            alt={item.title}
            aspect={featured ? "wide" : "landscape"}
            priority={priority}
            imageClassName="transition-transform duration-500 ease-brand group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className={cn(
            "rounded-sm border border-line-subtle bg-surface-subtle",
            featured ? "aspect-16/9" : "aspect-3/2",
          )}
        />
      )}

      <div className="flex flex-col gap-2.5">
        <ContentMeta dateTime={item.dateTime} author={item.author} />

        <h3
          className={cn(
            "jd-clamp-2 text-ink-strong",
            featured ? "text-heading" : "text-subheading",
          )}
        >
          <Link
            {...link}
            className="jd-stretch-link decoration-accent decoration-2 underline-offset-4 group-hover:underline"
          >
            {item.title}
          </Link>
        </h3>

        {item.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <li key={tag}>
                <Tag>#{tag}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};
