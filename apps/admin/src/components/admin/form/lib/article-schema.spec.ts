import { describe, expect, it } from "vitest";
import {
  EMPTY_ARTICLE_VALUES,
  articleFormSchema,
  galleryFormSchema,
} from "./article-schema";

const VALID = {
  author: "34기 김영민",
  title: "동계 훈련 후기",
  dateTime: "2026-01-05",
  tags: ["김영민", "이지호"],
  description: "오늘은 낙법을 했다.",
  imgSrcs: [{ originSrc: "https://cdn/a.png", smallSrc: null }],
};

const messagesOf = (result: { error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((issue) => issue.message) ?? [];

describe("articleFormSchema", () => {
  it("빈 폼은 작성자·제목·날짜·본문을 모두 지적한다", () => {
    const messages = messagesOf(
      articleFormSchema.safeParse(EMPTY_ARTICLE_VALUES),
    );

    expect(messages).toEqual([
      "작성자를 입력해주세요.",
      "제목을 입력해주세요.",
      "날짜를 선택해주세요.",
      "본문을 입력해주세요.",
    ]);
  });

  it("공백만 있는 값은 통과하지 못한다", () => {
    const result = articleFormSchema.safeParse({ ...VALID, title: "   " });

    expect(messagesOf(result)).toContain("제목을 입력해주세요.");
  });

  it("통과한 값은 앞뒤 공백이 정리된다", () => {
    const result = articleFormSchema.safeParse({
      ...VALID,
      author: "  34기 김영민  ",
      tags: [" 김영민 "],
    });

    expect(result.data?.author).toBe("34기 김영민");
    expect(result.data?.tags).toEqual(["김영민"]);
  });

  it("사진과 태그는 없어도 된다", () => {
    const result = articleFormSchema.safeParse({
      ...VALID,
      tags: [],
      imgSrcs: [],
    });

    expect(result.success).toBe(true);
  });
});

describe("galleryFormSchema", () => {
  it("작성자·제목·본문 없이 사진만 있어도 통과한다", () => {
    const result = galleryFormSchema.safeParse({
      ...EMPTY_ARTICLE_VALUES,
      dateTime: "2026",
      imgSrcs: [{ originSrc: "https://cdn/a.png", smallSrc: null }],
    });

    expect(result.success).toBe(true);
  });

  it("사진을 모두 지우는 것도 허용한다", () => {
    const result = galleryFormSchema.safeParse({
      ...EMPTY_ARTICLE_VALUES,
      dateTime: "2026",
    });

    expect(result.success).toBe(true);
  });
});
