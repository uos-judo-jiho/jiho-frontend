import { CommandPalette } from "@packages/jds/interactions";
import { v2Admin } from "@packages/api";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";

import { StaffAndAbove } from "@/components/admin/Main/menu";
import { cn } from "@/shared/lib/utils";

import { buildAdminCommands } from "./build-commands";
import { hangulMatch } from "./hangul-match";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.userAgent);

/**
 * ⌘K(Ctrl+K) 로 여는 관리자 커맨드 팔레트 — 페이지 이동 · 글 작성 · 회원 찾기.
 * 사이드바 맨 위의 "빠른 이동" 버튼으로도 연다.
 *
 * 다이얼로그(Radix 등)가 열려 있으면 그쪽이 포커스를 가둬 팔레트가 바로 닫힌다 —
 * 다이얼로그 위로 다른 화면을 띄우지 않으려는 의도와 같다.
 */
export const AdminCommandPalette = ({
  role,
  collapsed,
}: {
  role: string | null | undefined;
  collapsed: boolean;
}) => {
  const navigate = useNavigate();
  const canSeeMembers = !!role && StaffAndAbove.includes(role);

  // 회원 목록은 회원 메뉴를 볼 수 있을 때만 받는다 (회원 페이지와 같은 쿼리라 캐시를 같이 쓴다)
  const { data: users } = v2Admin.useListAdminUsers(undefined, {
    axios: { withCredentials: true },
    query: { enabled: canSeeMembers, select: (data) => data.data.users },
  });

  const commands = useMemo(
    () => buildAdminCommands({ role, users }),
    [role, users],
  );

  return (
    <CommandPalette
      commands={commands}
      onRun={(command) => navigate({ to: command.id })}
      contained={false}
      label="빠른 이동"
      placeholder="페이지, 글 작성, 회원 이름으로 찾기"
      emptyLabel="찾는 항목이 없습니다"
      // 한글 검색: 입력 중인 글자("회ㅇ") · 초성("ㅎㅇ")으로도 찾고, 맞은 곳을 브랜드 색으로 표시한다
      match={hangulMatch}
      markClassName="text-theme-highlight"
      // 패키지 버튼에 사이드바 항목 모양을 입힌다 (패키지 CSS 는 레이어 안이라 유틸리티가 이긴다)
      className={cn(
        "[&>button]:w-full [&>button]:rounded-lg [&>button]:border-0 [&>button]:bg-transparent [&>button]:p-0",
        "[--palette-highlight:var(--color-neutral-100)] [--palette-list-height:min(24rem,60vh)]",
        "[--palette-backdrop:color-mix(in_oklab,var(--color-neutral-950)_30%,transparent)]",
      )}
      panelClassName="w-[min(36rem,100%)] rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-xl"
      trigger={
        <span
          className={cn(
            "flex items-center rounded-lg px-4 py-3 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
            collapsed ? "justify-center px-2" : "justify-start gap-3",
          )}
        >
          <Search className="size-5 shrink-0" aria-hidden />
          <span className={cn("truncate", collapsed && "sr-only")}>
            빠른 이동
          </span>
          {!collapsed && (
            <kbd className="ml-auto rounded bg-neutral-100 px-1.5 py-0.5 font-sans text-xs text-neutral-500">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          )}
        </span>
      }
    />
  );
};
