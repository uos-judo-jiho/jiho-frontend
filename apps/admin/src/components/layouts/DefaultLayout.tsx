import React from "react";
import LNB from "../admin/Main/LNB";

type DefaultLayoutProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
};

function DefaultLayout({ children, showSidebar = false }: DefaultLayoutProps) {
  return (
    <div className="flex bg-neutral-50 min-h-screen">
      {showSidebar && <LNB />}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default DefaultLayout;
