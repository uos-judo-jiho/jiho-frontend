import { v2Api } from "@packages/api";

import { NoticeList } from "@/features/notice";
import { PageHeader } from "@/shared/ui/page-header";
import { PageShell } from "@/widgets/page-shell";

export const NoticeIndexPage = () => {
  const { data: notices = [] } = v2Api.useGetApiV2NoticesSuspense(undefined, {
    query: { select: (response) => response.data.notices ?? [] },
  });

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <PageHeader
          eyebrow="Notice"
          title="공지사항"
          description="부 운영과 행사에 관한 안내입니다."
        />
        <NoticeList notices={notices} />
      </div>
    </PageShell>
  );
};
