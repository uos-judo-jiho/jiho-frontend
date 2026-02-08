import NavItem from "@/components/admin/Main/NavItem";

const NavPage = () => {
  return (
    <>
      <NavItem linkTo={"/"} title={"uosjudo.com"} />
      <NavItem linkTo={"/training"} title={"훈련 일지 관리"} />
      <NavItem linkTo={"/news"} title={"지호지 관리"} />
      <NavItem linkTo={"/notice"} title={"공지사항 관리"} />
    </>
  );
};

export default NavPage;
