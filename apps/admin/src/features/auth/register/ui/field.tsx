import type { FieldError } from "react-hook-form";

export const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {error?.message && <p className="text-xs text-red-500">{error.message}</p>}
  </div>
);
