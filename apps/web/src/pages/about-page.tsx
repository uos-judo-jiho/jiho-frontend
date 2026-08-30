import { HomeIdentity } from "@/widgets/home";
import { PageShell } from "@/widgets/page-shell";
import { PageHeader } from "@/shared/ui/page-header";
import { SITE } from "@/shared/config/site";

export const AboutPage = () => (
  <PageShell>
    <div className="flex flex-col gap-14">
      <PageHeader
        eyebrow="About"
        title="지호를 소개합니다"
        description={`${SITE.foundingYear}년부터 이어져 온 ${SITE.name}입니다.`}
      />
      <HomeIdentity showEyebrow={false} />
    </div>
  </PageShell>
);
