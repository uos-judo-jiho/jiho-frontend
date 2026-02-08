import { cn } from "@/shared/lib/utils";
import React from "react";

type HomeSectionBGProps = {
  bgImageSrc: string;
  bgImageSrcWebp: string;
  bgImageAlt: string;
  children: React.ReactNode;
  id: string;
  backgroundCover?: boolean;
};

const HomeSectionBG = ({
  bgImageSrc,
  bgImageSrcWebp,
  bgImageAlt,
  children,
  id,
  backgroundCover = true,
}: HomeSectionBGProps) => {
  return (
    <section id={id} className="relative w-screen h-screen">
      <div className="absolute top-0 left-0 w-full h-full bg-black">
        <picture className="border-none outline-none">
          <source srcSet={bgImageSrcWebp} type="image/webp" />
          <source srcSet={bgImageSrc} type="image/jpeg" />
          <img
            src={bgImageSrc}
            alt={bgImageAlt}
            className={cn(
              "w-full h-full",
              backgroundCover ? "object-cover" : "object-contain"
            )}
          />
        </picture>
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background:
              "radial-gradient(circle at 40% 20%, rgba(0, 0, 0, 0) 0%, rgb(18, 18, 18) 90.2%)",
          }}
        />
      </div>
      {children}
    </section>
  );
};

export default HomeSectionBG;
