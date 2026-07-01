import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "#shared/lib/cn";

export const RadioCard = ({
  label,
  value,
  registration,
}: {
  label: string;
  value: string;
  registration: UseFormRegisterReturn;
}) => (
  <label className="flex-1 cursor-pointer">
    <input
      type="radio"
      value={value}
      {...registration}
      className="peer sr-only"
    />
    <span
      className={cn(
        "flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition",
        "border-slate-200 bg-white text-slate-600",
        "peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white",
        "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-200",
      )}
    >
      {label}
    </span>
  </label>
);
