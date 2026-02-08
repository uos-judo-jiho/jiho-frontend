import React from "react";

type DefaultLayoutProps = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main>
      {/* TODO: sidebar */}
      {children}
    </main>
  );
}

export default DefaultLayout;
