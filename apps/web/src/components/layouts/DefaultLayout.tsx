import React from "react";

import { StickyButton } from "@/components/common/Buttons/StickyButton";
import Footer from "@/components/common/Footer/footer";
import Navbar from "@/components/common/Navbar/Navbar";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">{children}</div>
        <StickyButton />
        <Footer />
      </main>
    </>
  );
}

export default DefaultLayout;
