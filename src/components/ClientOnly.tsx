import { useEffect, useState, ReactNode } from "react";

type Props = {
  children: ReactNode; // 브라우저에서만 평가
  fallback?: ReactNode; // SSR 시 보여줄 폴백
};

export const ClientOnly = ({ children, fallback = null }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return fallback;
  return <>{children}</>;
};
