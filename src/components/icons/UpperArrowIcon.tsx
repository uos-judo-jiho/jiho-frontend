import BaseSvgComponent, {
  BaseSvgProps,
} from "@/components/common/BaseSvgComponent";

export const UpperArrowIcon: React.FC<BaseSvgProps> = ({ size = 24, ...props }) => {
  return (
    <BaseSvgComponent viewBox="0 0 48 48" size={size} {...props}>
      <path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z" />
    </BaseSvgComponent>
  );
};
