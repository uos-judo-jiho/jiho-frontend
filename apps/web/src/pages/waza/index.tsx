import { PageHeader } from "@/shared/ui";
import { PageShell } from "@/widgets/page-shell";
import { JudoMotion, TECHNIQUES } from "judo-motion/react";

export const WazaPage = () => {
  return (
    <PageShell>
      <div className="flex flex-col gap-14">
        <PageHeader
          title="유도 기술"
          description="유도의 기본 기술들을 소개합니다."
        />
        <section className="flex-1">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(TECHNIQUES).map((technique) => (
              <div
                key={technique.id}
                className="flex flex-col items-start gap-4"
              >
                <JudoMotion technique={technique.id} className="w-48" mat />
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{technique.ko}</h3>
                  <p className="text-sm text-muted-foreground">
                    {technique.ja} ({technique.romaji})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {technique.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <footer className="flex text-sm text-muted-foreground">
          기술에 대한 설명은 틀릴 수 있습니다. 제보는 이메일 (
          <a
            href="mailto:uosjudojiho@gmail.com"
            className="hover:underline hover:text-primary"
          >
            uosjudojiho@gmail.com
          </a>
          ) 혹은 인스타그램 (
          <a
            href="https://www.instagram.com/uos_judo/"
            className="hover:underline hover:text-primary"
          >
            @uosjudojiho
          </a>
          )으로 부탁드립니다.
        </footer>
      </div>
    </PageShell>
  );
};
