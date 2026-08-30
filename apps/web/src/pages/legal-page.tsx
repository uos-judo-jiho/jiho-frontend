import { LEGAL_DOCUMENTS, type LegalDocumentSlug } from "@/features/legal";
import { Markdown } from "@/shared/ui/markdown";
import { PageShell } from "@/widgets/page-shell";

type LegalPageProps = {
  slug: LegalDocumentSlug;
};

export const LegalPage = ({ slug }: LegalPageProps) => {
  const { content } = LEGAL_DOCUMENTS[slug];

  return (
    <PageShell width="prose">
      <Markdown content={content} />
    </PageShell>
  );
};
