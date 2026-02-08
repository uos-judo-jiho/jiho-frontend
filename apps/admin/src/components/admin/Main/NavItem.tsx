import { ArrowForwardIosIcon } from "@/components/icons";
import { Link } from "react-router-dom";

type NavItemProps = {
  linkTo: string;
  title: string;
};

function NavItem({ linkTo, title }: NavItemProps) {
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

export default NavItem;
