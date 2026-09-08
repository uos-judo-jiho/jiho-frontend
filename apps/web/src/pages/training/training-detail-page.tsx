import { Link, getRouteApi, linkOptions } from "@tanstack/react-router";
import { useEffect } from "react";

import { logger } from "@99mini/logger-client";

import { ArticleDetail, toNeighbour, useBoardDetail } from "@/features/content";
import { formatDate } from "@/shared/lib/format";
import { PageShell } from "@/widgets/page-shell";

const routeApi = getRouteApi("/photo/$id");

const linkTo = (id: number) =>
  linkOptions({ to: "/photo/$id", params: { id: String(id) } });

/** 훈련일지 상세. PC/모바일 두 벌이던 것을 하나로 합쳤다. */
export const TrainingDetailPage = () => {
  const { id } = routeApi.useParams();

  // 게시판 종류를 가리지 않는 단건 엔드포인트 하나로 모였다 (api#41).
  // 앞뒤 글도 같은 응답에 담겨 오므로 아카이브를 통째로 내려받을 이유가 없고,
  // 목록이 페이지네이션돼도 앞뒤가 어긋나지 않는다.
  // 없는 id·다른 게시판의 id 는 라우트 loader 가 notFound 로 걸러낸다.
  const training = useBoardDetail(Number(id));

  useEffect(() => {
    logger.info("훈련일지", {
      // logger 의 res 는 Record<string, unknown> 인데 BoardDetail 은 interface 라
      // 암묵적 인덱스 시그니처가 없어 그대로는 대입되지 않는다. 펼쳐서 넘긴다.
      res: { ...training },
      path: window.location.pathname,
    });
  }, [training]);

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
          item={{
            ...training,
            title: training.title || formatDate(training.dateTime),
          }}
          tagsLabel="참여 인원"
          // 훈련일지는 제목 없이 올라오는 글이 많아 링크가 빈칸이 되기 쉽다
          newer={toNeighbour(training.next, linkTo, "다음 훈련일지")}
          older={toNeighbour(training.prev, linkTo, "이전 훈련일지")}
        />
      </div>
    </PageShell>
  );
};
