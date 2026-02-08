import { CloseIcon } from "@/components/icons";
import { cn } from "@/shared/lib/utils";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AdminMenu from "./AdminMenu";

import { useNavbar } from "../Navbar/NavBar.provider";

const SIDEBAR_ANIMATION_DURATION = 500;

const SideBar = () => {
  const { open, setOpen } = useNavbar();

  const outside = useRef<any>();

  const timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null> =
    useRef(null);

  const toggleSide = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      timer.current = setTimeout(() => {}, SIDEBAR_ANIMATION_DURATION);
    } else {
    }

    return () => {
      if (timer && timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [open]);

  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof document === "undefined") return;

    const handlerOutside = (e: any) => {
      if (!outside.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlerOutside);
    return () => {
      document.removeEventListener("mousedown", handlerOutside);
    };
  }, [setOpen]);

  // Don't render during SSR to avoid document.body error
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      id="sidebar"
      ref={outside}
      className={cn(
        "z-[1] pt-[50px] px-5 pb-5",
        "bg-theme-bg shadow-[4px_10px_10px_rgba(0,0,0,0.2)]",
        "h-full min-w-[420px]",
        "fixed -left-full top-0",
        "transition-all duration-500",
        "max-[539px]:min-w-0 max-[539px]:w-full",
        open && "!left-0",
      )}
    >
      <CloseIcon
        onClick={toggleSide}
        title="Close sidebar"
        className="absolute top-3 left-3 w-5 h-5 z-[1] cursor-pointer"
      />
      <nav>
        <AdminMenu />
      </nav>
    </div>,
    document.body,
  );
};

export default SideBar;
