import { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/shared/lib/utils";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

const PageHeader = ({
  icon: Icon,
  title,
  description,
  rightElement,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Icon className="w-6 h-6 text-neutral-900" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          {description && (
            <p className="text-neutral-500 text-sm">{description}</p>
          )}
        </div>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

export default PageHeader;
