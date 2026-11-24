import type { Command } from "@packages/jds/interactions";
import { describe, expect, it } from "vitest";

import { hangulMatch } from "./hangul-match";

const cmd = (label: string, extra: Partial<Command> = {}): Command => ({
  id: label,
  label,
  ...extra,
});

/** 하이라이트되는 글자들 */
const marked = (label: string, query: string) =>
  (hangulMatch(cmd(label), query)?.ranges ?? []).map(([a, b]) =>
    [...label].slice(a, b).join(""),
  );

describe("hangulMatch", () => {
  it("입력 중인 글자로도 찾는다 — '회ㅇ' · '회워' → 회원", () => {
    expect(marked("회원", "회ㅇ")).toEqual(["회원"]);
    expect(marked("회원", "회워")).toEqual(["회원"]);
    expect(marked("회원", "회")).toEqual(["회"]);
  });

  it("초성으로 찾는다 — 'ㅎㅇ' → 회원, 'ㅈㅎㅈ' → 지호지", () => {
    expect(marked("회원", "ㅎㅇ")).toEqual(["회원"]);
    expect(marked("지호지", "ㅈㅎㅈ")).toEqual(["지호지"]);
  });

  it("이름의 일부와 기수가 붙은 label 에서도 맞은 곳만 표시한다", () => {
    expect(marked("김지호 (41기)", "김ㅈ")).toEqual(["김지"]);
    expect(marked("김지호 (41기)", "지호")).toEqual(["지호"]);
  });

  it("띄어 쓴 단어는 모두 맞아야 하고, 각각 표시한다", () => {
    expect(marked("공지 작성", "공지 작")).toEqual(["공지", "작"]);
    expect(hangulMatch(cmd("공지 작성"), "공지 수정")).toBeNull();
  });

  it("label 에 없으면 hint · keywords 에서 찾는다 (표시는 없다)", () => {
    const user = cmd("김지호 (41기)", {
      hint: "회원",
      keywords: ["kim@example.com", "7"],
    });
    expect(hangulMatch(user, "kim@")?.ranges).toEqual([]);
    expect(hangulMatch(user, "ㅎㅇ")).not.toBeNull();
    expect(hangulMatch(user, "운영진")).toBeNull();
  });

  it("영문은 대소문자 없이, 순서는 시작 > 단어 첫머리 > 그 밖", () => {
    expect(marked("Notice", "noti")).toEqual(["Noti"]);
    expect(hangulMatch(cmd("회원 목록"), "회")?.score).toBe(3);
    expect(hangulMatch(cmd("전체 회원"), "회")?.score).toBe(2);
    expect(hangulMatch(cmd("등급회원"), "회")?.score).toBe(1);
  });

  it("빈 검색어는 모두 맞는다", () => {
    expect(hangulMatch(cmd("홈"), "  ")).toEqual({});
  });
});
