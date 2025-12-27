import { Link, useLocation } from "react-router-dom";

import { MenuIcon } from "@/components/icons";

import SideBar from "@/components/common/SideBar/SideBar";
import Logo from "@/components/Logo";

import { ClientOnly } from "@/components/ClientOnly";
import { cn } from "@/shared/lib/utils";
import { NavbarProvider, useNavbar } from "./NavBar.provider";

const NavMenu = ({ isDark }: { isDark: boolean }) => {
  const { setOpen } = useNavbar();

  return (
    <nav className="my-auto" onClick={() => setOpen((prev) => !prev)}>
      <MenuIcon
        className={cn(
          "cursor-pointer hover:opacity-60",
          !isDark &&
            "[filter:invert(100%)_sepia(3%)_saturate(607%)_hue-rotate(209deg)_brightness(116%)_contrast(87%)]"
        )}
        title="Menu"
      />
    </nav>
  );
};

function Navbar({ isDark }: { isDark?: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 z-[1] h-[60px]">
      <NavbarProvider>
        <div className="h-full">
          <div className="flex justify-between">
            <NavMenu isDark={isDark || currentPath !== "/"} />
            <div className="flex items-center justify-center">
              <Link to={"/"}>
                <Logo size={"52px"} isDark={isDark || currentPath !== "/"} />
              </Link>
            </div>
          </div>
        </div>
        <ClientOnly>
          <SideBar />
        </ClientOnly>
      </NavbarProvider>
    </header>
  );
}

export default Navbar;
