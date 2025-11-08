import BaseSvgComponent, {
  BaseSvgProps,
} from "@/components/common/BaseSvgComponent";

export const ArrowBackIosIcon: React.FC<BaseSvgProps> = ({
  size = 24,
  ...props
}) => {
  return (
    <BaseSvgComponent viewBox="0 0 20 20" size={size} {...props}>
      <path d="m8 18-8-8 8-8 1.417 1.417L2.833 10l6.584 6.583Z" />
    </BaseSvgComponent>
  );
};
