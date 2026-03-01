import { cn } from "@/shared/lib/utils";

export type BadgeProps = {
  theme: "blue" | "green" | "red" | "yellow" | "gray";
  children: React.ReactNode;
};

export const Badge = ({ theme, children }: BadgeProps) => {
  const themeClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <div
      className={cn(
        themeClasses[theme] || "bg-gray-100 text-gray-800",
        "w-fit px-2 py-1 rounded-full text-sm font-medium",
      )}
    >
      {children}
    </div>
  );
};

Badge.displayName = "Badge";
