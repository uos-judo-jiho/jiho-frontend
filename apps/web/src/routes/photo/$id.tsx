import { createFileRoute, linkOptions, notFound } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { TrainingDetailPage } from "@/pages/training/training-detail-page";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageShell } from "@/widgets/page-shell";

import { boardDetailQueryOptions } from "@/features/content";
import { createArticleData } from "@/features/seo";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { toPlainExcerpt } from "@/shared/lib/format";

export const Route = createFileRoute("/photo/$id")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title"> & { title?: string }> => {
    // 상세 화면이 쓰는 바로 그 쿼리를 프리페치한다 — 인자가 같아야 컴포넌트가
    // 다시 받지 않는다. 예전에는 훈련일지 전체 목록을 받아 그중 하나를 찾았다.
    let info;
    try {
      const response = await context.queryClient.ensureQueryData(
        boardDetailQueryOptions(Number(params.id)),
      );
      info = response.data;
    } catch (error) {
      // 없는 글은 오류가 아니라 404 다. 목록에서 찾지 못하던 자리를 대신한다.
      if (isAxiosError(error) && error.response?.status === 404) {
        throw notFound();
      }
      console.error("[SSR] Training detail prefetch error:", error);
      return {};
    }

    // 게시글 id 는 세 게시판이 함께 쓴다 — 훈련일지가 아닌 글은 여기서 열지 않는다.
    if (info.type !== "training") {
      throw notFound();
    }

    const description = [info.title, toPlainExcerpt(info.description, 140)]
      .filter(Boolean)
      .join(" | ");

    const publishedDate = info.dateTime
      ? new Date(info.dateTime).toISOString()
      : undefined;

    const structuredData = createArticleData({
      headline: [info.title, info.author].join(" - ") || "",
      description,
      images: info.images.map((img) => img.originSrc),
      datePublished: publishedDate,
      dateModified: publishedDate,
    });

    return {
      title: `훈련일지 - ${info.author}`,
      description,
      imgUrl: info.images.at(0)?.originSrc,
      articleType: "article",
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: info.author,
      structuredData,
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <EmptyState
        title="해당 훈련일지를 찾을 수 없습니다"
        action={
          <MoreLink link={linkOptions({ to: "/photo" })}>
            훈련일지 목록으로
          </MoreLink>
        }
      />
    </PageShell>
  ),
  head: ({ loaderData, params }) =>
    seoHead({
      title: loaderData?.title ?? "훈련일지",
      pathname: `/photo/${params.id}`,
      ...loaderData,
    }),
  component: TrainingDetailPage,
});
