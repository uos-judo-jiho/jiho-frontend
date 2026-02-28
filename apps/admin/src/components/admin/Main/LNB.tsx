import { RouterUrl } from "@/app/routers/router-url";
import { cn } from "@/shared/lib/utils";
import { v2Admin } from "@packages/api";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  Home,
  LogOut,
  Menu,
  Newspaper,
  Trophy,
  Users,
} from "lucide-react";
import { Suspense, useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "홈", path: RouterUrl.홈 },
  {
    icon: Users,
    label: "회원",
    path: RouterUrl.회원.목록,
    allowedRoles: ["root", "president", "manager", "staff"],
  },
  { icon: BookOpen, label: "훈련", path: RouterUrl.훈련일지.목록 },
  { icon: Newspaper, label: "지호지", path: RouterUrl.뉴스.목록 },
  { icon: Bell, label: "공지", path: RouterUrl.공지사항.목록 },
  { icon: Trophy, label: "수상내역", path: RouterUrl.수상내역 },
];

export const LNB = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const { data: meData } = v2Admin.useGetApiV2AdminMeSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data,
    },
  });

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const userRole = meData.user.role;

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "p-6 border-b border-gray-100 flex items-center",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <h1
          className={cn(
            "text-xl font-bold text-neutral-800 truncate",
            isCollapsed ? "w-0" : "w-auto",
          )}
        >
          지호 관리자
        </h1>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
          title={isCollapsed ? "펼치기" : "접기"}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems
          .filter(
            (item) =>
              !item.allowedRoles ||
              (userRole && item.allowedRoles.includes(userRole)),
          )
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : ""}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                isCollapsed ? "justify-center px-2" : "justify-start",
                isActive(item.path)
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive(item.path)
                    ? "text-neutral-900"
                    : "text-neutral-500 group-hover:text-neutral-700",
                )}
              />
              <span className={cn("truncate", isCollapsed ? "w-0" : "w-auto")}>
                {item.label}
              </span>
            </Link>
          ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Suspense>
          <UserInfoButton isCollapsed={isCollapsed} meData={meData} />
        </Suspense>
      </div>
    </aside>
  );
};

const UserInfoButton = ({
  isCollapsed,
  meData,
}: {
  isCollapsed: boolean;
  meData: any;
}) => {
  const logoutMutation = v2Admin.usePostApiV2AdminLogout({
    axios: { withCredentials: true },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      },
    });
  }, [logoutMutation]);

  return (
    <div>
      <div
        title={isCollapsed ? meData?.user.email || "사용자 정보" : ""}
        className={cn(
          "flex items-center gap-3 px-4 py-3 w-full text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 rounded-lg transition-colors mb-2",
          isCollapsed ? "justify-center px-2" : "justify-start",
        )}
      >
        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-sm font-medium text-neutral-600">
          {meData?.user.email ? meData.user.email.charAt(0).toUpperCase() : "U"}
        </div>

        <span className={cn("truncate", isCollapsed ? "w-0 hidden" : "w-auto")}>
          {meData?.user.email || "사용자 정보"}
        </span>
      </div>
      <button
        onClick={handleLogout}
        title={isCollapsed ? "로그아웃" : ""}
        className={cn(
          "flex items-center gap-3 px-4 py-3 w-full text-neutral-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors",
          isCollapsed ? "justify-center px-2" : "justify-start",
        )}
      >
        <LogOut className="w-3 h-3 shrink-0" />
        <span className={cn("text-sm", isCollapsed ? "w-0 hidden" : "w-auto")}>
          로그아웃
        </span>
      </button>
    </div>
  );
};
