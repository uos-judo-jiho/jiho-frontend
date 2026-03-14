import { cn } from "@/shared/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  icon: Icon,
  title,
  description,
  badge,
  rightElement,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-neutral-100 rounded-lg shrink-0">
            <Icon className="w-6 h-6 text-neutral-900" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-neutral-500 text-sm">{description}</p>
          )}
        </div>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};
