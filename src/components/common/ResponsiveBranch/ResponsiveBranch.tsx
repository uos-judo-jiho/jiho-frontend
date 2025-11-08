import { useState, useEffect } from "react";

interface ResponsiveBranchProps {
  pcComponent: React.ReactNode;
  mobileComponent: React.ReactNode;
}

const ResponsiveBranch = ({
  pcComponent,
  mobileComponent,
}: ResponsiveBranchProps) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 540);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // SSR 시에는 PC 버전만 렌더링 (SEO 최적화)
  if (isMobile === null) {
    return <>{pcComponent}</>;
  }

  return <>{isMobile ? mobileComponent : pcComponent}</>;
};

export default ResponsiveBranch;
