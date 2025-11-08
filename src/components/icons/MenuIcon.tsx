import BaseSvgComponent, {
  BaseSvgProps,
} from "@/components/common/BaseSvgComponent";

export const MenuIcon: React.FC<BaseSvgProps> = (props) => {
  return (
    <BaseSvgComponent size={48} viewBox="0 0 48 48" {...props}>
      <path fill="current" d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z" />
    </BaseSvgComponent>
  );
};
