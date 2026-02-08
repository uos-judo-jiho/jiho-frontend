import { ArrowForwardIosIcon } from "@/components/icons";
import { ExternalIcon } from "@/components/icons/external-icon";
import { Link } from "react-router-dom";

type NavItemProps = {
  linkTo: string;
  title: string;
  external?: boolean;
};

function NavItem({ linkTo, title, external }: NavItemProps) {
  return (
    <li className="flex items-center">
      <Link
        to={linkTo}
        target={external ? "_blank" : "_self"}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-end">
          <span className="text-theme-default">{title}</span>
          {external ? (
            <ExternalIcon className="w-5 h-5 ml-2.5" />
          ) : (
            <ArrowForwardIosIcon title="Navigate" className="w-5 h-5 ml-2.5" />
          )}
        </div>
      </Link>
    </li>
  );
}

export default NavItem;
