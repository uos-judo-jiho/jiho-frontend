import { v2Api } from "@packages/api";
import { Link, getRouteApi, linkOptions } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { logger } from "@99mini/logger-client";

import { ArticleDetail } from "@/features/content";
import { formatDate } from "@/shared/lib/format";
import { EmptyState } from "@/shared/ui/empty-state";
import { MoreLink } from "@/shared/ui/more-link";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/photo/$id");

/** 훈련일지 상세. PC/모바일 두 벌이던 것을 하나로 합쳤다. */
export const TrainingDetailPage = () => {
  const { id } = routeApi.useParams();

  const { data: trainings = [] } = v2Api.useGetApiV2TrainingsSuspense(
    undefined,
    { query: { select: (response) => response.data.trainingLogs ?? [] } },
  );

  const sorted = useMemo(
    () => [...trainings].sort((a, b) => b.dateTime.localeCompare(a.dateTime)),
    [trainings],
  );

  const index = sorted.findIndex((item) => String(item.id) === String(id));
  const training = index >= 0 ? sorted[index] : undefined;

  useEffect(() => {
    if (!training) return;
    logger.info("훈련일지", {
      res: training,
      path: window.location.pathname,
    });
  }, [training]);

  if (!training) {
    return (
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
    );
  }

  const linkTo = (target: (typeof sorted)[number]) =>
    linkOptions({ to: "/photo/$id", params: { id: String(target.id) } });

  return (
    <PageShell>
      <div className="flex flex-col gap-10">
        <Link
          {...linkOptions({ to: "/photo" })}
          className="group inline-flex w-fit items-center gap-2 text-caption text-ink-muted transition-colors hover:text-ink-strong"
        >
          <span
            aria-hidden
            className="transition-transform duration-200 ease-brand group-hover:-translate-x-1"
          >
            ←
          </span>
          훈련일지
        </Link>

        <ArticleDetail
          item={{ ...training, title: training.title || formatDate(training.dateTime) }}
          tagsLabel="참여 인원"
          position={{ current: index + 1, total: sorted.length }}
          prev={
            index > 0
              ? { label: sorted[index - 1].title, link: linkTo(sorted[index - 1]) }
              : null
          }
          next={
            index < sorted.length - 1
              ? { label: sorted[index + 1].title, link: linkTo(sorted[index + 1]) }
              : null
          }
        />
      </div>
    </PageShell>
  );
};
