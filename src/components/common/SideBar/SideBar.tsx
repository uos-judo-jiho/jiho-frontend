import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import CloseSvg from "@/lib/assets/svgs/close.svg";
import AdminMenu from "./AdminMenu";
import ClientMenu from "./ClientMenu";
import { SelectedType } from "./MenuStyledComponents";

import { useNavbar } from "../Navbar/NavBar.provider";

const SIDEBAR_ANIMATION_DURATION = 500;

const Container = styled.div`
  z-index: 1;
  padding: 50px 20px 20px 20px;

  background-color: ${(props) => props.theme.bgColor};
  box-shadow: 4px 10px 10px rgba(0, 0, 0, 0.2);

  height: 100%;
  min-width: 420px;

  position: fixed;
  left: -100%;
  top: 0;

  transition: ${SIDEBAR_ANIMATION_DURATION}ms;

  &.open {
    left: 0;
    transition: ${SIDEBAR_ANIMATION_DURATION}ms;
  }
  @media (max-width: 539px) {
    min-width: auto;
    width: 100%;
  }
`;
const NavWrapper = styled.nav``;

const StyledClose = styled.img`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 20px;
  height: 20px;
  z-index: 1;
  cursor: pointer;
`;

const SideBar = () => {
  const { open, setOpen } = useNavbar();

  const outside = useRef<any>();

  const location = useLocation();

  const [selected, setSelected] = useState<[SelectedType, SelectedType]>([
    "closed",
    "closed",
  ]);

  const timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null> =
    useRef(null);

  const toggleSide = () => {
    setSelected(["closed", "closed"]);
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
    if (typeof document === 'undefined') return;

    const handlerOutside = (e: any) => {
      if (!outside.current.contains(e.target)) {
        setSelected(["closed", "closed"]);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlerOutside);
    return () => {
      document.removeEventListener("mousedown", handlerOutside);
    };
  }, [setOpen]);

  // Don't render during SSR to avoid document.body error
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <Container id="sidebar" ref={outside} className={open ? "open" : undefined}>
      <StyledClose onClick={toggleSide} src={CloseSvg} />
      <NavWrapper>
        {location.pathname.includes("/admin") ? (
          <AdminMenu />
        ) : (
          <ClientMenu selected={selected} setSelected={setSelected} />
        )}
      </NavWrapper>
    </Container>,
    document.body
  );
};

export default SideBar;
