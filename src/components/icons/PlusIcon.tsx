import BaseSvgComponent, {
  BaseSvgProps,
} from "@/components/common/BaseSvgComponent";

export const PlusIcon: React.FC<BaseSvgProps> = (props) => {
  return (
    <BaseSvgComponent size={20} viewBox="0 0 20 20" {...props}>
      <path d="M9.25 15v-4.25H5v-1.5h4.25V5h1.5v4.25H15v1.5h-4.25V15Z" />
    </BaseSvgComponent>
  );
};
