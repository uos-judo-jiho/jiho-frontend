import { cn } from "@/shared/lib/utils";
import { HTMLProps } from "react";

const MenuList = ({ className, ...props }: HTMLProps<HTMLUListElement>) => (
  <ul className={cn("text-sm", "space-y-2", className)} {...props} />
);

// 네비게이션이 아니라 서브메뉴를 여닫는 토글이므로 Link 가 아닌 앵커로 렌더한다
const MenuToggle = ({
  className,
  children,
  ...props
}: HTMLProps<HTMLAnchorElement>) => (
  <a role="button" className={cn("cursor-pointer", className)} {...props}>
    {children}
  </a>
);

const MenuItemTitle = ({
  className,
  children,
  ...props
}: HTMLProps<HTMLSpanElement>) => (
  <span
    className={cn(
      "leading-[200%] cursor-pointer hover:text-gray-500 text-base",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

const MenuItem = ({ className, ...props }: HTMLProps<HTMLLIElement>) => (
  <li className={cn("mx-2", className)} {...props} />
);

export type SelectedType = "selected" | "animate" | "closed";

export type MenuProps = {
  selected: [SelectedType, SelectedType];
  setSelected: React.Dispatch<
    React.SetStateAction<[SelectedType, SelectedType]>
  >;
};

export { MenuItem, MenuItemTitle, MenuList, MenuToggle };
