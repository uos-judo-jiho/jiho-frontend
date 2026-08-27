import { linkOptions } from "@tanstack/react-router";

import { ArticleCard } from "@/features/content";
import type { ContentItem } from "@/shared/lib/types/content";

type NewsCardProps = {
  article: ContentItem;
  year: string | number;
  variant?: "default" | "featured";
  priority?: boolean;
};

export const NewsCard = ({
  article,
  year,
  variant,
  priority,
}: NewsCardProps) => (
  <ArticleCard
    item={article}
    variant={variant}
    priority={priority}
    link={linkOptions({
      to: "/news/$id/$newsId",
      params: { id: String(year), newsId: String(article.id) },
    })}
  />
);
