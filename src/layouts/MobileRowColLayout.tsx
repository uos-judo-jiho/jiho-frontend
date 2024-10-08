import React, { useEffect, useState } from "react";
import Col from "./Col";
import Row from "./Row";

type MobileRowColLayoutProps = {
  children: React.ReactNode;
  rowJustifyContent?: string;
  rowAlignItems?: string;
  colJustifyContent?: string;
  colAlignItems?: string;
};

function MobileRowColLayout({
  children,
  rowAlignItems,
  rowJustifyContent,
  colAlignItems,
  colJustifyContent,
}: MobileRowColLayoutProps) {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return (
    <>
      {windowSize[0] >= 540 ? (
        <Row justifyContent={rowJustifyContent} alignItems={rowAlignItems}>
          {children}
        </Row>
      ) : (
        <Col justifyContent={colJustifyContent} alignItems={colAlignItems}>
          {children}
        </Col>
      )}
    </>
  );
}

export default MobileRowColLayout;
