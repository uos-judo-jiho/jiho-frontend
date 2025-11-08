import { Link } from "react-router-dom";
import { ArrowForwardIosIcon } from "@/components/icons";

type AdminNavItemProps = {
  linkTo: string;
  title: string;
};

function AdminNavItem({ linkTo, title }: AdminNavItemProps) {
  return (
    <div className="p-2.5 flex items-center">
      <Link to={linkTo}>
        <div className="flex items-end">
          <span className="text-theme-default">{title}</span>
          <ArrowForwardIosIcon title="Navigate" className="w-5 ml-2.5" />
        </div>
      </Link>
    </div>
  );
}

export default AdminNavItem;
