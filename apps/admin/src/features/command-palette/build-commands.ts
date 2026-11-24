import type { Command } from "@packages/jds/interactions";

import { RouterUrl } from "@/app/routers/router-url";
import {
  canSee,
  GeneralAndAbove,
  menuItems,
  StaffAndAbove,
} from "@/components/admin/Main/menu";
import { getUserRole } from "@/features/user/utils/get-user-role";

/** 팔레트가 찾는 회원 — 목록 API 응답에서 쓰는 필드만 */
export type PaletteUser = {
  id: number;
  role: Parameters<typeof getUserRole>[0];
  email?: string | null;
  additionalInfo?: { name?: string | null; generation?: number | null } | null;
};

/**
 * 관리자 커맨드 팔레트의 명령. id 가 곧 이동할 경로다.
 * 메뉴와 같은 역할 규칙을 따른다 — 권한이 없는 페이지로 보내는 명령은 만들지 않는다.
 */
export const buildAdminCommands = ({
  role,
  users = [],
  year = new Date().getFullYear(),
}: {
  role: string | null | undefined;
  users?: readonly PaletteUser[];
  year?: number;
}): Command[] => {
  const go: Command[] = [
    ...menuItems
      .filter((item) => canSee(item, role))
      .map((item) => ({
        id: item.path,
        label: item.label,
        group: "이동",
      })),
    { id: RouterUrl.마이페이지.루트, label: "마이페이지", group: "이동" },
    {
      id: RouterUrl.마이페이지.비밀번호변경,
      label: "비밀번호 변경",
      group: "이동",
      keywords: ["password"],
    },
  ];

  const write: Command[] = [
    {
      id: RouterUrl.공지사항.작성,
      label: "공지 작성",
      group: "작성",
      keywords: ["새", "글", "notice"],
      allowedRoles: StaffAndAbove,
    },
    {
      id: RouterUrl.훈련일지.작성,
      label: "훈련일지 작성",
      group: "작성",
      keywords: ["새", "글", "training"],
      allowedRoles: GeneralAndAbove,
    },
    {
      id: RouterUrl.뉴스.작성({ year }),
      label: `${year} 지호지 작성`,
      group: "작성",
      keywords: ["새", "글", "뉴스", "news"],
      allowedRoles: GeneralAndAbove,
    },
  ]
    .filter((command) => canSee(command, role))
    .map(({ allowedRoles: _, ...command }) => command);

  // 회원 상세는 회원 메뉴를 볼 수 있는 역할만
  const members: Command[] = canSee({ allowedRoles: StaffAndAbove }, role)
    ? users.map((user) => {
        const name = user.additionalInfo?.name;
        const generation = user.additionalInfo?.generation;
        return {
          id: RouterUrl.회원.상세({ id: user.id }),
          label: name
            ? `${name}${generation ? ` (${generation}기)` : ""}`
            : (user.email ?? `회원 ${user.id}`),
          hint: getUserRole(user.role),
          keywords: [user.email ?? "", String(user.id)],
          group: "회원",
        };
      })
    : [];

  return [...go, ...write, ...members];
};
