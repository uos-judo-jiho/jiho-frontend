import NavItem from "@/components/admin/Main/NavItem";
import { v2Admin } from "@packages/api";
import { useCallback } from "react";
import { RouterUrl } from "@/app/routers/router-url";

const NavPage = () => {
  const { refetch } = v2Admin.useGetApiV2AdminMe({
    query: { retry: false },
    axios: { withCredentials: true },
  });

  const logoutMutation = v2Admin.usePostApiV2AdminLogout({
    axios: { withCredentials: true },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.status === 200) {
          refetch();
        }
      },
    });
  }, [logoutMutation, refetch]);

  return (
    <ul className="flex flex-col gap-4">
      <NavItem linkTo={RouterUrl.훈련일지.목록} title={"훈련 일지 관리"} />
      <NavItem linkTo={RouterUrl.뉴스.목록} title={"지호지 관리"} />
      <NavItem linkTo={RouterUrl.공지사항.목록} title={"공지사항 관리"} />
      <NavItem linkTo={RouterUrl.수상내역} title={"수상이력 관리"} />
      <li className="border-t border-neutral-200 my-2" />
      <NavItem linkTo={"https://uosjudo.com"} title={"uosjudo.com"} external />
      <li>
        <button
          className="text-grey-500 underline hover:text-grey-600 transition-colors"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </li>
    </ul>
  );
};

export default NavPage;
