import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/pages/legal-page";

import { seoHead } from "@/features/seo/head";
import { LEGAL_DOCUMENTS } from "@/features/legal";

const document = LEGAL_DOCUMENTS.privacy;

export const Route = createFileRoute("/privacy")({
  head: () =>
    seoHead({
      title: document.title,
      description: document.description,
      pathname: document.path,
    }),
  component: () => <LegalPage slug="privacy" />,
});
