import { ArrowBackIosIcon, ArrowForwardIosIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type ArrowProps = {
  current: number;
  length: number;
  size?: string;
  id?: string;
  $isMobileVisible?: boolean;
  $isBackGround?: boolean;
  $mobileSize?: string;
  $horizontalPosition?: string;
  $isVisible?: boolean;
};

const StyledBackArrow = (
  props: ArrowProps &
    Omit<React.SVGProps<SVGSVGElement>, keyof ArrowProps | "ref">
) => {
  const {
    current,
    length,
    $horizontalPosition,
    size,
    $mobileSize,
    id,
    $isMobileVisible,
    $isBackGround,
    $isVisible,
    ...rest
  } = props;

  const isVisible = current !== 0 || $isVisible;
  const displayClass = $isMobileVisible ? "flex" : "hidden sm:flex";

  return (
    <ArrowBackIosIcon
      id={id}
      title="Previous"
      className={cn(
        "absolute z-[1] top-1/2 -translate-y-1/2 select-none cursor-pointer hover:opacity-80",
        isVisible ? displayClass : "!hidden",
        $isBackGround &&
          "rounded-full p-1 bg-muted shadow-[0_0_0.2rem_hsl(var(--black))]",
        "max-sm:hidden",
        $isMobileVisible && "max-sm:flex"
      )}
      style={{
        width: size || "24px",
        height: size || "24px",
        left: $horizontalPosition || "1.2rem",
        ...(typeof window !== "undefined" &&
          window.innerWidth <= 539 && {
            width: $mobileSize || "24px",
            height: $mobileSize || "24px",
          }),
      }}
      {...rest}
    />
  );
};

const StyledForwardArrow = (
  props: ArrowProps &
    Omit<React.SVGProps<SVGSVGElement>, keyof ArrowProps | "ref">
) => {
  const {
    current,
    length,
    $horizontalPosition,
    size,
    $mobileSize,
    id,
    $isMobileVisible,
    $isBackGround,
    $isVisible,
    ...rest
  } = props;

  const isVisible = current < length - 1 || $isVisible;
  const displayClass = $isMobileVisible ? "flex" : "hidden sm:flex";

  return (
    <ArrowForwardIosIcon
      id={id}
      title="Next"
      className={cn(
        "absolute z-[1] top-1/2 -translate-y-1/2 select-none cursor-pointer hover:opacity-80",
        isVisible ? displayClass : "!hidden",
        $isBackGround && "rounded-full p-1 bg-muted",
        "max-sm:hidden",
        $isMobileVisible && "max-sm:flex"
      )}
      style={{
        width: size || "24px",
        height: size || "24px",
        right: $horizontalPosition || "1.2rem",
        ...(typeof window !== "undefined" &&
          window.innerWidth <= 539 && {
            width: $mobileSize || "24px",
            height: $mobileSize || "24px",
          }),
      }}
      {...rest}
    />
  );
};

export { StyledBackArrow, StyledForwardArrow };
