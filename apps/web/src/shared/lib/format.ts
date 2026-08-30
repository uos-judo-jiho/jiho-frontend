import type { Award } from "@/shared/lib/types/content";

/** "2024-03-05" → "2024. 03. 05." */
export const formatDate = (value: string | undefined | null): string => {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year) return value;
  return [year, month, day].filter(Boolean).join(". ") + ".";
};

/** "2024-03-05" → 2024 */
export const yearOf = (value: string | undefined | null): number =>
  new Date(value ?? Date.now()).getFullYear();

type Medal = { label: string; count: number; suffix?: string };

/**
 * 수상 이력을 화면에 쓰기 좋은 조각들로 나눈다.
 * 이전 formatAwardsType 은 " 금 3 은 1 " 처럼 앞뒤 공백이 섞인 문자열 하나를
 * 만들어서, 메달별로 스타일을 다르게 줄 수가 없었다.
 */
export const awardMedals = (award: Award): Medal[] =>
  (
    [
      { label: "금", count: award.gold },
      { label: "은", count: award.silver },
      { label: "동", count: award.bronze },
      { label: "남자 단체", count: award.menGroup, suffix: "위" },
      { label: "여자 단체", count: award.womenGroup, suffix: "위" },
      { label: "혼성 단체", count: award.group, suffix: "위" },
    ] satisfies Medal[]
  ).filter((medal) => medal.count > 0);

/** 목록 미리보기용 — 마크다운 기호를 걷어내고 한 줄로 줄인다. */
export const toPlainExcerpt = (text: string, maxLength = 100): string => {
  const plain = text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크·이미지는 텍스트만 남긴다
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
};
