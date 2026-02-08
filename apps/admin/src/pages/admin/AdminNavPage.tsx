import AdminNavItem from "@/components/admin/Main/AdminNavItem";

const AdminNavPage = () => {
  return (
    <>
      <AdminNavItem linkTo={"/"} title={"uosjudo.com"} />
      <AdminNavItem linkTo={"/training"} title={"훈련 일지 관리"} />
      <AdminNavItem linkTo={"/news"} title={"지호지 관리"} />
      <AdminNavItem linkTo={"/notice"} title={"공지사항 관리"} />
    </>
  );
};

export default AdminNavPage;
