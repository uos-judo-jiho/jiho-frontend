import { cn } from "@/shared/lib/utils";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "../common/Footer";

type SheetWrapperProps = {
  children: React.ReactNode;
  className?: string;
  paddingTop?: number;
};

function SheetWrapper({
  children,
  paddingTop = 92,
  className,
}: SheetWrapperProps) {
  const location = useLocation();
  const rawSegments = location.pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  const labelMap: Record<string, string> = {
    home: "홈",
    training: "훈련",
    news: "지호지",
    notice: "공지",
    gallery: "갤러리",
    awards: "수상내역",
    write: "작성",
  };

  const formatSegmentLabel = (segment: string) => {
    if (labelMap[segment]) {
      return labelMap[segment];
    }

    if (/^\d{4}$/.test(segment)) {
      return `${segment}년`;
    }

    if (/^\d+$/.test(segment)) {
      return `#${segment}`;
    }

    return decodeURIComponent(segment);
  };

  const crumbs = rawSegments.length === 0 ? ["home"] : ["home", ...rawSegments];

  return (
    <div
      className={cn(
        "relative mx-auto",
        "w-full",
        "sm:w-[640px]",
        "md:w-[768px]",
        "lg:w-[1040px]",
        "xl:w-[1280px]",
        "flex flex-col min-h-screen",
        className,
      )}
      style={{ paddingTop: `${paddingTop}px` }}
    >
      <div className="flex-1">
        <nav className="pb-4 text-md text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((segment, index) => {
              const path =
                index === 0 ? "/" : `/${crumbs.slice(1, index + 1).join("/")}`;
              const label = formatSegmentLabel(segment);
              const isLast = index === crumbs.length - 1;

              return (
                <li
                  key={`${path}-${label}`}
                  className="flex items-center gap-2"
                >
                  {isLast ? (
                    <span className="text-neutral-800 font-medium">
                      {label}
                    </span>
                  ) : (
                    <Link className="hover:text-neutral-800" to={path}>
                      {label}
                    </Link>
                  )}
                  {!isLast && <span className="text-neutral-400">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default SheetWrapper;
