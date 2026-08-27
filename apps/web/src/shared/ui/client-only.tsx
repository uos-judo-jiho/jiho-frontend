import { ReactNode, useSyncExternalStore } from "react";

type Props = {
  children: ReactNode; // 브라우저에서만 평가
  fallback?: ReactNode; // SSR 시 보여줄 폴백
};

// 구독할 외부 스토어가 없으므로 구독은 no-op 이다.
const subscribe = () => () => {};

export const ClientOnly = ({ children, fallback = null }: Props) => {
  // 서버 스냅샷은 항상 false, 클라이언트 스냅샷은 항상 true 이므로
  // 하이드레이션 직후 한 번만 children 으로 전환된다.
  // (useEffect + setState 방식과 동작은 같지만 추가 렌더를 만들지 않는다)
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return fallback;
  return <>{children}</>;
};
