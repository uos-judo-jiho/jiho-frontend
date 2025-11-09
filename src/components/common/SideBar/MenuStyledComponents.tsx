import { HTMLProps } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const MenuList = ({ className, ...props }: HTMLProps<HTMLUListElement>) => (
  <ul className={cn("text-sm", "space-y-2", className)} {...props} />
);

const MenuToggle = ({
  className,
  ...props
}: React.ComponentProps<typeof Link>) => (
  <Link className={className} {...props} />
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
