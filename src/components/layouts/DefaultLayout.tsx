import styled from "styled-components";

import React from "react";
import StickyButton from "@/components/common/Buttons/StickyButton";
import Footer from "@/components/common/Footer/footer";
import Navbar from "@/components/common/Navbar/Navbar";

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StretchedContainer = styled.div`
  flex: 1;
`;

type DefaultLayoutProps = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <MainContainer>
        <Navbar />
        <StretchedContainer>{children}</StretchedContainer>
        <StickyButton />
        <Footer />
      </MainContainer>
    </>
  );
}

export default DefaultLayout;
