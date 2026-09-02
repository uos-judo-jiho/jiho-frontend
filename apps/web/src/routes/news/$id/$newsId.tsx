import { createFileRoute, linkOptions, notFound } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { NewsDetailPage } from "@/pages/news/news-detail-page";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageShell } from "@/widgets/page-shell";

import { boardDetailQueryOptions } from "@/features/content";
import { createArticleData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { toPlainExcerpt } from "@/shared/lib/format";

export const Route = createFileRoute("/news/$id/$newsId")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title"> & { title?: string }> => {
    const year = Number(params.id);
    const articleId = Number(params.newsId);

    // 상세 화면이 쓰는 바로 그 쿼리 하나만 프리페치한다. 앞뒤 글도 같은 응답에
    // 담겨 오므로 연도 전체 목록을 함께 받을 이유가 없다.
    let article;
    try {
      const response = await context.queryClient.ensureQueryData(
        boardDetailQueryOptions(articleId, "year"),
      );
      article = response.data;
    } catch (error) {
      // 없는 글은 오류가 아니라 404 다.
      if (isAxiosError(error) && error.response?.status === 404) {
        throw notFound();
      }
      console.error("[SSR] News article prefetch error:", error);
      return {};
    }

    // 게시글 id 는 세 게시판이 함께 쓰므로, 지호지가 아닌 글이 /news 주소로
    // 열리지 않도록 종류와 연도를 확인한다.
    if (article.type !== "news" || !article.dateTime.startsWith(String(year))) {
      throw notFound();
    }

    const description = [
      article.title,
      toPlainExcerpt(article.description, 140),
    ].join(" | ");

    const publishedDate = article.dateTime
      ? new Date(article.dateTime).toISOString()
      : undefined;

    const structuredData = createArticleData({
      headline: `${year}년 지호지 - ${article.title}`,
      description,
      images: article.images.map((img) => img.originSrc),
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: article.author,
    });

    return {
      title: `${year}년 지호지 - ${article.title}`,
      description,
      imgUrl: article.images.at(0)?.originSrc,
      articleType: "article",
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: article.author ?? "",
      structuredData,
    };
  },
  notFoundComponent: () => {
    const { id: year } = Route.useParams();
    return (
      <PageShell>
        <EmptyState
          title="해당 지호지를 찾을 수 없습니다"
          description="삭제되었거나 주소가 바뀐 글일 수 있습니다."
          action={
            <MoreLink
              link={linkOptions({ to: "/news/$id", params: { id: year } })}
            >
              {year}년 목록으로
            </MoreLink>
          }
        />
      </PageShell>
    );
  },
  head: ({ loaderData, params }) =>
    seoHead({
      title: loaderData?.title ?? `${params.id}년 지호지`,
      pathname: `/news/${params.id}/${params.newsId}`,
      ...loaderData,
    }),
  component: NewsDetailPage,
});
