import React from "react";
import Col from "./Col";
import Row from "./Row";

type MobileRowColLayoutProps = {
  children: React.ReactNode;
  rowJustifyContent?: string;
  rowAlignItems?: string;
  colJustifyContent?: string;
  colAlignItems?: string;
  mobileProps?: {
    className?: string;
  };
};

export function MobileRowColLayout({
  children,
  rowAlignItems,
  rowJustifyContent,
  colAlignItems,
  colJustifyContent,
  mobileProps,
}: MobileRowColLayoutProps) {
  return (
    <>
      <Row justifyContent={rowJustifyContent} alignItems={rowAlignItems} $pc>
        {children}
      </Row>
      <Col
        justifyContent={colJustifyContent}
        alignItems={colAlignItems}
        className={mobileProps?.className}
        mobile
      >
        {children}
      </Col>
    </>
  );
}
