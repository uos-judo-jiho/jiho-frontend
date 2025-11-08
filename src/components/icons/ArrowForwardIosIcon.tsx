import BaseSvgComponent, {
  BaseSvgProps,
} from "@/components/common/BaseSvgComponent";

export const ArrowForwardIosIcon: React.FC<BaseSvgProps> = ({ size = 24, ...props }) => {
  return (
    <BaseSvgComponent viewBox="0 0 20 20" size={size} {...props}>
      <path d="m6 18-1.417-1.417L11.167 10 4.583 3.417 6 2l8 8Z" />
    </BaseSvgComponent>
  );
};
