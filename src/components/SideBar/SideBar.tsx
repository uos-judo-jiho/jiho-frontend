import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as CloseSvg } from "../../assets/svgs/close.svg";
import AdminMenu from "./AdminMenu";
import ClientMenu from "./ClientMenu";
import { SelectedType } from "./MenuStyledComponents";

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Function;
};

const SIDEBAR_ANIMATION_DURATION = 500;

const Container = styled.div`
  z-index: 1;
  padding: 50px 20px 20px 20px;
  background-color: ${(props) => props.theme.bgColor};
  box-shadow: 4px 10px 10px rgba(0, 0, 0, 0.2);
  height: 100%;
  min-width: 420px;
  left: -55%;
  top: 0;
  position: fixed;
  transition: ${SIDEBAR_ANIMATION_DURATION}ms;
  &.open {
    left: 0;
    transition: ${SIDEBAR_ANIMATION_DURATION}ms;
  }
  &.animated {
    display: none;
  }
  @media (max-width: 539px) {
    width: 100%;
    left: -100%;
  }
`;
const NavWrapper = styled.nav``;

const StyledClose = styled(CloseSvg)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 20px;
  height: 20px;
  z-index: 1;
  cursor: pointer;
`;

const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const outside = useRef<any>();

  const location = useLocation();

  const [selected, setSelected] = useState<[SelectedType, SelectedType]>(["closed", "closed"]);
  const [isanimated, setIsanimated] = useState(true);
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  const timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef(null);

  const toggleSide = () => {
    setSelected(["closed", "closed"]);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      timer.current = setTimeout(() => {
        setIsanimated(true);
      }, SIDEBAR_ANIMATION_DURATION);
    } else {
      setIsanimated(false);
    }

    return () => {
      if (timer && timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handlerOutside = (e: any) => {
      if (!outside.current.contains(e.target)) {
        setSelected(["closed", "closed"]);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlerOutside);
    return () => {
      document.removeEventListener("mousedown", handlerOutside);
    };
  }, [setIsOpen]);

  useEffect(() => {
    if (prevLocation !== location.pathname) {
      setSelected(["closed", "closed"]);
      setIsOpen(false);
      setPrevLocation(location.pathname);
    }
  }, [location.pathname, prevLocation, setIsOpen]);

  return createPortal(
    <Container id="sidebar" ref={outside} className={`${[isOpen ? "open" : "", isanimated ? "animated" : ""].filter((_) => _).join(" ")}`}>
      <StyledClose onClick={toggleSide} />
      <NavWrapper>{location.pathname.includes("/admin") ? <AdminMenu /> : <ClientMenu selected={selected} setSelected={setSelected} />}</NavWrapper>
    </Container>,
    document.body
  );
};

export default SideBar;
