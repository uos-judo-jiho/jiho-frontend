import React, { useEffect, useRef } from "react";

type ScrollSnapProps = {
  children: React.ReactNode;
  setIsDark: (isDark: boolean) => void;
};

const ScrollSnap = ({ children, setIsDark }: ScrollSnapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSectionId = (index: number) => {
      switch (index) {
        case 0:
          return "main";
        case 1:
          return "info";
        case 2:
          return "news";
        case 3:
          return "exercise";
        case 4:
          return "more";
        case 5:
          return "footer";
        default:
          return "";
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section-id");

            if (sectionId) {
              setIsDark(sectionId === "footer");
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.2,
      }
    );

    const childElements = Array.from(container.children);
    childElements.forEach((child, index) => {
      const sectionId = getSectionId(index);
      child.setAttribute("data-section-id", sectionId);
      observer.observe(child);
    });

    return () => {
      childElements.forEach((child) => {
        observer.unobserve(child);
      });
    };
  }, [setIsDark]);

  return (
    <div
      ref={containerRef}
      className="scroll-smooth h-screen overflow-y-scroll [&>*]:snap-start"
      style={{
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        div[class*="scroll-smooth"]::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>
      {children}
    </div>
  );
};

export default ScrollSnap;
