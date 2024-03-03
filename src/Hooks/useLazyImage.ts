import { useEffect, useRef, useState } from "react";

export default function useLazyImage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    // IntersectionObserver 설정
    const intersectionOberserver = (
      entries: IntersectionObserverEntry[],
      io: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 관찰되고 있는 entry가 보여지게 된 다면
          io.unobserve(entry.target); // 관찰 종료
          setIsLoading(true); // 로딩 체크
          if (isLoading) {
            console.log(imgRef);
          }
        }
      });
    };
    observer.current = new IntersectionObserver(intersectionOberserver); // 인스턴스 생성
    imgRef.current && observer.current.observe(imgRef.current); // 이미지 태그 관찰 시작
  }, [isLoading]);

  return { imgRef, isLoading, setIsLoading };
}
