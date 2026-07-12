import privacyContent from "../content/privacy.md?raw";
import termsContent from "../content/terms.md?raw";

export type LegalDocumentSlug = "terms" | "privacy";

export type LegalDocument = {
  slug: LegalDocumentSlug;
  path: string;
  title: string;
  description: string;
  content: string;
};

export const LEGAL_DOCUMENTS: Record<LegalDocumentSlug, LegalDocument> = {
  terms: {
    slug: "terms",
    path: "/terms",
    title: "서비스 이용약관",
    description: "서울시립대학교 유도 동아리 지호 웹사이트의 서비스 이용약관",
    content: termsContent,
  },
  privacy: {
    slug: "privacy",
    path: "/privacy",
    title: "개인정보 처리방침",
    description:
      "서울시립대학교 유도 동아리 지호가 수집하는 개인정보의 항목, 이용 목적, 보유 기간 안내",
    content: privacyContent,
  },
};
