import { createFileRoute, linkOptions, notFound } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { NoticeDetailPage } from "@/pages/notice/notice-detail-page";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageShell } from "@/widgets/page-shell";

import { boardDetailQueryOptions } from "@/features/content";
import { seoHead, type SeoHeadOptions } from "@/features/seo/head";
import { toPlainExcerpt } from "@/shared/lib/format";

/** 공지 이미지가 문자열 URL 또는 {originSrc} 객체 어느 쪽이어도 URL 을 뽑아낸다 */
const extractImageUrl = (image: unknown): string | undefined => {
  if (typeof image === "string") {
    return image;
  }
  if (
    image &&
    typeof image === "object" &&
    "originSrc" in image &&
    typeof (image as { originSrc?: unknown }).originSrc === "string"
  ) {
    return (image as { originSrc: string }).originSrc;
  }
  return undefined;
};

export const Route = createFileRoute("/notice/$id")({
  loader: async ({
    context,
    params,
  }): Promise<Omit<SeoHeadOptions, "title">> => {
    // 상세 화면이 쓰는 바로 그 쿼리를 프리페치한다.
    let data;
    try {
      const response = await context.queryClient.ensureQueryData(
        boardDetailQueryOptions(Number(params.id)),
      );
      data = response.data;
    } catch (error) {
      // 없는 글은 오류가 아니라 404 다. 예전에는 목록에 없으면 화면에서
      // /notice 로 되돌려보냈는데, 그러면 주소가 틀렸다는 사실이 드러나지 않았다.
      if (isAxiosError(error) && error.response?.status === 404) {
        throw notFound();
      }
      console.error("[SSR] Notice detail prefetch error:", error);
      return {};
    }

    // 게시글 id 는 세 게시판이 함께 쓴다 — 공지가 아닌 글은 여기서 열지 않는다.
    if (data.type !== "notice") {
      throw notFound();
    }

    return {
      description: [data.title, toPlainExcerpt(data.description, 140)]
        .filter(Boolean)
        .join(" | "),
      imgUrl: extractImageUrl(data.images[0]),
    };
  },
  notFoundComponent: () => (
    <PageShell width="prose">
      <EmptyState
        title="해당 공지사항을 찾을 수 없습니다"
        description="삭제되었거나 주소가 바뀐 글일 수 있습니다."
        action={
          <MoreLink link={linkOptions({ to: "/notice" })}>
            공지사항 목록으로
          </MoreLink>
        }
      />
    </PageShell>
  ),
  head: ({ loaderData, params }) =>
    seoHead({
      title: "Notice",
      pathname: `/notice/${params.id}`,
      ...loaderData,
    }),
  component: NoticeDetailPage,
});
