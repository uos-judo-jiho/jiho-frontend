import React from "react";
import StickyButton from "../components/Buttons/StickyButton";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

type DefaultLayoutProps = {
  children: React.ReactNode;
};
function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <StickyButton />
      <Footer />
    </>
  );
}

export default DefaultLayout;
