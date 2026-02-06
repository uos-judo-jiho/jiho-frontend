import BaseSvgComponent, {
  BaseSvgProps,
} from "@/components/common/BaseSvgComponent";

export const CloseIcon: React.FC<BaseSvgProps> = (props) => {
  return (
    <BaseSvgComponent viewBox="8 8 32 32" size={20} {...props}>
      <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
    </BaseSvgComponent>
  );
};
