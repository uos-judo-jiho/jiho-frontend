import { describe, expect, it } from "vitest";

import { buildAdminCommands, type PaletteUser } from "./build-commands";

const users: PaletteUser[] = [
  {
    id: 7,
    role: "general",
    email: "a@example.com",
    additionalInfo: { name: "김지호", generation: 41 },
  },
  { id: 9, role: "staff", email: "b@example.com", additionalInfo: null },
];

const ids = (role: string | null) =>
  buildAdminCommands({ role, users, year: 2026 }).map((c) => c.id);

describe("buildAdminCommands", () => {
  it("운영진 이상은 모든 메뉴 · 작성 · 회원 상세를 찾는다", () => {
    const list = ids("staff");
    expect(list).toEqual(
      expect.arrayContaining([
        "/",
        "/users",
        "/notice",
        "/awards",
        "/notice/write",
        "/training/write",
        "/news/2026/write",
        "/users/7",
        "/users/9",
      ]),
    );
  });

  it("일반 회원은 메뉴와 같은 범위만 — 공지 · 수상 · 회원 명령이 없다", () => {
    const list = ids("general");
    expect(list).toContain("/training/write");
    expect(list).toContain("/news/2026/write");
    expect(list).not.toContain("/notice/write");
    expect(list).not.toContain("/users");
    expect(list).not.toContain("/awards");
    expect(list.some((id) => id.startsWith("/users/"))).toBe(false);
  });

  it("졸업생은 영상 라벨링까지, 역할이 없으면 홈 · 마이페이지만", () => {
    expect(ids("graduate")).toContain("/videos");
    expect(ids("graduate")).not.toContain("/training/write");
    expect(ids(null)).toEqual(["/", "/mypage", "/mypage/password-change"]);
  });

  it("회원은 이름(기수)으로, 이름이 없으면 이메일로 보인다", () => {
    const members = buildAdminCommands({ role: "root", users }).filter(
      (c) => c.group === "회원",
    );
    expect(members.map((c) => c.label)).toEqual([
      "김지호 (41기)",
      "b@example.com",
    ]);
    expect(members[0]?.hint).toBe("회원");
  });
});
