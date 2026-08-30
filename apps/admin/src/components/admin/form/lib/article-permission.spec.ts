import { describe, expect, it } from "vitest";

import { getArticlePermission } from "./article-permission";

describe("getArticlePermission", () => {
  describe("지호지 작성자 선택", () => {
    it.each(["root", "president", "manager"])(
      "임원 이상(%s)은 지호지 작성자를 직접 입력할 수 있다",
      (role) => {
        expect(getArticlePermission({ type: "news", role })).toEqual({
          canEdit: true,
          canEditAuthor: true,
        });
      },
    );

    it.each(["staff", "general"])(
      "임원 미만(%s)은 지호지를 쓸 수 있지만 작성자는 고정된다",
      (role) => {
        expect(getArticlePermission({ type: "news", role })).toEqual({
          canEdit: true,
          canEditAuthor: false,
        });
      },
    );

    it("회원은 본인 명의의 지호지만 수정할 수 있다", () => {
      expect(
        getArticlePermission({
          type: "news",
          role: "general",
          myName: "김영민",
          articleAuthor: "34기 김영민 (컴과 18)",
        }).canEdit,
      ).toBe(true);

      expect(
        getArticlePermission({
          type: "news",
          role: "general",
          myName: "김영민",
          articleAuthor: "34기 이지호",
        }).canEdit,
      ).toBe(false);
    });

    it("관리자/회장은 남의 지호지도 수정할 수 있다", () => {
      expect(
        getArticlePermission({
          type: "news",
          role: "president",
          myName: "김영민",
          articleAuthor: "34기 이지호",
        }),
      ).toEqual({ canEdit: true, canEditAuthor: true });
    });

    it("이름 정보가 없으면 남의 글을 수정할 수 없다", () => {
      expect(
        getArticlePermission({
          type: "news",
          role: "general",
          articleAuthor: "34기 이지호",
        }).canEdit,
      ).toBe(false);
    });
  });

  describe("훈련일지 - 기존 정책 유지", () => {
    it.each(["root", "president", "manager", "staff", "general"])(
      "회원 이상(%s)은 훈련일지를 쓰고 작성자도 입력할 수 있다",
      (role) => {
        expect(getArticlePermission({ type: "training", role })).toEqual({
          canEdit: true,
          canEditAuthor: true,
        });
      },
    );

    it("졸업생/외부인은 훈련일지를 쓸 수 없다", () => {
      expect(getArticlePermission({ type: "training", role: "graduate" })).toEqual(
        { canEdit: false, canEditAuthor: false },
      );
    });
  });

  describe("공지사항 - 기존 정책 유지", () => {
    it("운영 부원 이상만 공지사항을 쓸 수 있다", () => {
      expect(getArticlePermission({ type: "notice", role: "staff" })).toEqual({
        canEdit: true,
        canEditAuthor: true,
      });
      expect(getArticlePermission({ type: "notice", role: "general" })).toEqual({
        canEdit: false,
        canEditAuthor: false,
      });
    });
  });

  it("등급 정보가 없으면 아무것도 할 수 없다", () => {
    expect(getArticlePermission({ type: "news" })).toEqual({
      canEdit: false,
      canEditAuthor: false,
    });
  });
});
