import MarkdownRenderer from "@/components/common/Markdown/MarkdownRenderer";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SheetWrapper from "@/components/layouts/SheetWrapper";
import { LEGAL_DOCUMENTS, type LegalDocumentSlug } from "@/features/legal";
import MyHelmet from "@/features/seo/helmet/MyHelmet";

type LegalDocumentPageProps = {
  slug: LegalDocumentSlug;
};

const LegalDocumentPage = ({ slug }: LegalDocumentPageProps) => {
  const { title, description, content } = LEGAL_DOCUMENTS[slug];

  return (
    <>
      <MyHelmet title={title} description={description} />
      <DefaultLayout>
        <SheetWrapper className="px-4 pb-16">
          <MarkdownRenderer content={content} />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
};

export default LegalDocumentPage;
