import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "../../../shared/lib/cn";

export const TextInput = ({
  registration,
  invalid,
  type = "text",
  placeholder,
  inputMode,
  maxLength,
  prefix,
}: {
  registration: UseFormRegisterReturn;
  invalid?: boolean;
  type?: string;
  placeholder?: string;
  inputMode?: "numeric";
  maxLength?: number;
  prefix?: string;
}) => {
  const borderClass = invalid
    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
    : "border-slate-200 focus-within:border-slate-400 focus-within:ring-slate-200";

  if (prefix) {
    return (
      <div
        className={cn(
          "flex h-11 w-full items-center rounded-lg border bg-white focus-within:ring-2",
          borderClass,
        )}
      >
        <span className="select-none border-r border-slate-200 px-3 text-sm text-slate-500">
          {prefix}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          {...registration}
          className="h-full w-full rounded-r-lg bg-transparent px-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      {...registration}
      className={cn(
        "h-11 w-full rounded-lg border bg-white px-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
        invalid
          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
      )}
    />
  );
};
