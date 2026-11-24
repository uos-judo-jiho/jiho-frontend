import type {
  Command,
  CommandMatch,
  CommandMatcher,
} from "@packages/jds/interactions";
import { disassemble, getChoseong } from "es-hangul";

const SYLLABLE = /[가-힣]/;
const ONLY_CHOSEONG = /^[ㄱ-ㅎ]+$/;

/** 글자 하나하나의 자모 (한글이 아니면 소문자 그대로) — 맞은 위치를 글자 단위로 되돌리기 위해 글자별로 둔다 */
const jamoPerChar = (text: string) =>
  [...text].map((ch) =>
    SYLLABLE.test(ch) ? disassemble(ch) : ch.toLowerCase(),
  );

/** 글자 하나하나의 초성 (한글이 아니면 그대로) — 글자 수와 길이가 같다 */
const choseongPerChar = (text: string) =>
  [...text]
    .map((ch) => (SYLLABLE.test(ch) ? getChoseong(ch) : ch.toLowerCase()))
    .join("");

type Hit = { range: [number, number]; atStart: boolean; atWord: boolean };

/**
 * word 가 text 의 어디서 맞는지 — 글자 단위 [시작, 끝).
 * 1) 자모로 풀어서 비교: "회ㅇ" · "회워" 처럼 입력 중인 글자도 "회원" 에 맞는다 (글자 경계에서 시작할 때만)
 * 2) 검색어가 초성만이면 초성끼리: "ㅎㅇ" → "회원"
 */
const findIn = (text: string, word: string): Hit | null => {
  const chars = [...text];
  const hitAt = (start: number, end: number): Hit => ({
    range: [start, end],
    atStart: start === 0,
    atWord: start === 0 || /\s/.test(chars[start - 1] ?? ""),
  });

  if (ONLY_CHOSEONG.test(word)) {
    const at = choseongPerChar(text).indexOf(word);
    if (at !== -1) return hitAt(at, at + [...word].length);
  }

  const jamo = jamoPerChar(text);
  const target = disassemble(word.toLowerCase());
  for (let start = 0; start < jamo.length; start++) {
    const rest = jamo.slice(start).join("");
    if (!rest.startsWith(target)) continue;
    // 검색어 자모를 다 덮는 데 필요한 글자까지
    let end = start;
    for (let covered = 0; covered < target.length; end++)
      covered += jamo[end]?.length ?? 1;
    return hitAt(start, end);
  }
  return null;
};

/**
 * 관리자 팔레트의 한글 검색. 띄어 쓴 단어가 모두 label · hint · keywords 어딘가에서 맞아야 한다.
 * label 에서 맞은 곳을 하이라이트하고, label 이 검색어로 시작 > 단어 첫머리 > 그 밖 순으로 위에 둔다.
 */
export const hangulMatch: CommandMatcher = (
  command: Command,
  query: string,
): CommandMatch | null => {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return {};

  const others = [command.hint ?? "", ...(command.keywords ?? [])];
  const ranges: [number, number][] = [];
  let score = 0;

  for (const [i, word] of words.entries()) {
    const inLabel = findIn(command.label, word);
    if (inLabel) {
      ranges.push(inLabel.range);
      // 첫 단어가 어디서 맞았는지로 순서를 정한다
      if (i === 0) score = inLabel.atStart ? 3 : inLabel.atWord ? 2 : 1;
      continue;
    }
    if (!others.some((text) => findIn(text, word))) return null;
  }
  return { ranges, score };
};
