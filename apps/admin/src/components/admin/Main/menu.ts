import {
  Bell,
  BookOpen,
  Film,
  Home,
  Newspaper,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

import { RouterUrl } from "@/app/routers/router-url";

/**
 * 관리자 메뉴와 역할별 노출 규칙. 사이드바(LNB)와 커맨드 팔레트가 같이 쓴다 —
 * 한쪽에만 고치면 팔레트가 권한 없는 페이지로 보내거나, 메뉴에 있는 페이지를 못 찾는다.
 */
export const StaffAndAbove = ["root", "president", "manager", "staff"];
export const GeneralAndAbove = [...StaffAndAbove, "general"];
export const VideoLabelingRoles = [...GeneralAndAbove, "graduate"];

export type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  /** 없으면 모두에게 보인다 */
  allowedRoles?: string[];
};

export const menuItems: MenuItem[] = [
  { icon: Home, label: "홈", path: RouterUrl.홈 },
  {
    icon: Users,
    label: "회원",
    path: RouterUrl.회원.목록,
    allowedRoles: StaffAndAbove,
  },
  {
    icon: BookOpen,
    label: "훈련",
    path: RouterUrl.훈련일지.목록,
    allowedRoles: GeneralAndAbove,
  },
  {
    icon: Newspaper,
    label: "지호지",
    path: RouterUrl.뉴스.목록,
    allowedRoles: GeneralAndAbove,
  },
  {
    icon: Bell,
    label: "공지",
    path: RouterUrl.공지사항.목록,
    allowedRoles: StaffAndAbove,
  },
  {
    icon: Trophy,
    label: "수상내역",
    path: RouterUrl.수상내역,
    allowedRoles: StaffAndAbove,
  },
  {
    icon: Film,
    label: "영상 라벨링",
    path: RouterUrl.영상.목록,
    allowedRoles: VideoLabelingRoles,
  },
];

export const canSee = (
  item: { allowedRoles?: string[] },
  role: string | null | undefined,
) => !item.allowedRoles || (!!role && item.allowedRoles.includes(role));
