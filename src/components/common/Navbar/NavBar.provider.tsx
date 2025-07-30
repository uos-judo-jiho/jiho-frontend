import { createContext, useContext, useState } from "react";

const NavbarContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: ((condition: boolean) => condition) as React.Dispatch<React.SetStateAction<boolean>>,
});

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return <NavbarContext.Provider value={{ open, setOpen }}>{children}</NavbarContext.Provider>;
};
