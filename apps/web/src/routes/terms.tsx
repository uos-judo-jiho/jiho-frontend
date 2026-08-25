import { createFileRoute } from "@tanstack/react-router";

import LegalDocumentPage from "@/pages/Legal/LegalDocumentPage";

import { seoHead } from "@/features/seo/head";
import { LEGAL_DOCUMENTS } from "@/features/legal";

const document = LEGAL_DOCUMENTS.terms;

export const Route = createFileRoute("/terms")({
  head: () =>
    seoHead({
      title: document.title,
      description: document.description,
      pathname: document.path,
    }),
  component: () => <LegalDocumentPage slug="terms" />,
});
