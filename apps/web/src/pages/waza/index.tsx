import { PageHeader } from "@/shared/ui";
import { PageShell } from "@/widgets/page-shell";
import {
  JudoMotion,
  TECHNIQUES,
  TECHNIQUE_CATEGORIES,
} from "@uos-judo-jiho/judo-motion/react";

export const WazaPage = () => {
  const groupbyCategory = Object.values(TECHNIQUES).reduce(
    (acc, technique) => {
      const category = TECHNIQUE_CATEGORIES[technique.category].nameKo;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(technique);
      return acc;
    },
    {} as Record<string, (typeof TECHNIQUES)[number][]>,
  );

  return (
    <PageShell>
      <div className="flex flex-col">
        <PageHeader
          title="유도 기술"
          description="유도의 기본 기술들을 소개합니다."
        />
        <section className="flex-1 mt-8">
          <div className="">
            {Object.entries(groupbyCategory).map(([category, techniques]) => (
              <div key={category} className="flex flex-col gap-4 mb-8">
                <h2 className="text-xl font-semibold">{category}</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {techniques.map((technique) => (
                    <div
                      key={technique.id}
                      className="flex flex-col items-start gap-4"
                    >
                      <JudoMotion
                        technique={technique.id}
                        className="w-48"
                        mat
                        tori="cat"
                        uke="cat"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold">
                          {technique.ko}{" "}
                          {technique.variant
                            ? `(${technique.variant.label})`
                            : ""}
                        </h3>
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
              </div>
            ))}
          </div>
        </section>
        <hr className="border-line-strong mt-8 mb-4" />
        <footer className="text-sm text-muted-foreground">
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
