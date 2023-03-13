import AdminNavItem from "../../components/admin/AdminNavItem";

function AdminNavPage() {
  return (
    <>
      <AdminNavItem linkTo={"/"} title={"uosjudo.com"} />
      <AdminNavItem linkTo={"/admin/training"} title={"훈련 일지 관리"} />
      <AdminNavItem linkTo={"/admin/news"} title={"지호지 관리"} />
    </>
  );
}

export default AdminNavPage;
