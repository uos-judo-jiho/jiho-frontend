import NavItem from "@/components/admin/Main/NavItem";

const NavPage = () => {
  return (
    <ul className="flex flex-col gap-4">
      <NavItem linkTo={"https://uosjudo.com"} title={"uosjudo.com"} external />
      <NavItem linkTo={"/training"} title={"훈련 일지 관리"} />
      <NavItem linkTo={"/news"} title={"지호지 관리"} />
      <NavItem linkTo={"/notice"} title={"공지사항 관리"} />
    </ul>
  );
};

export default NavPage;
