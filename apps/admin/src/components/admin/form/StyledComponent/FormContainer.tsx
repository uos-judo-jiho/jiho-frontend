import { cn } from "@/shared/lib/utils";
import React, { forwardRef } from "react";

export const StyledLabel: React.FC<
  React.LabelHTMLAttributes<HTMLLabelElement>
> = ({ className, ...props }) => (
  <label className={cn("text-sm", className)} {...props} />
);

export const FormContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("bg-gray-50 p-5 mb-5", className)} {...props}>
    {children}
  </div>
);

export const InputContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex flex-col gap-2 m-2.5", className)} {...props}>
    {children}
  </div>
);

export const ButtonContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div className={cn("flex justify-center gap-3", className)} {...props}>
    {children}
  </div>
);

export const CancelButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => (
  <button
    className={cn(
      "mt-2.5 cursor-pointer text-sm bg-yellow-500 border border-yellow-500 text-white px-5 py-2.5 mr-2.5 hover:opacity-60",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const StyledInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className, type, ...props }) => {
  const baseClasses =
    type === "text" || type === "password"
      ? "h-6 px-2 py-2 border border-black/20"
      : type === "submit"
        ? "mt-2.5 cursor-pointer text-sm bg-blue-500 border border-blue-500 text-white px-5 py-2.5 hover:opacity-60"
        : "";

  return (
    <input type={type} className={cn(baseClasses, className)} {...props} />
  );
};

export const StyledTextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ...props }) => (
  <textarea
    className={cn(
      "min-h-[300px] p-2 border border-black/20 resize-y leading-[160%]",
      className,
    )}
    {...props}
  />
);

export const TagsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex justify-start items-center gap-2.5", className)}
    {...props}
  >
    {children}
  </div>
);

export const TagAddButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => (
  <button className={cn("", className)} {...props}>
    {children}
  </button>
);

export const TagDeleteButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => (
  <button className={cn("", className)} {...props}>
    {children}
  </button>
);

export const PreviewContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div
    className={cn("grid grid-rows-2 gap-2.5 grid-cols-5", className)}
    {...props}
  >
    {children}
  </div>
);

export const PreviewImgContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex flex-col justify-center items-center text-sm",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));

export const PreviewImg: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = ({ className, ...props }) => (
  <img
    className={cn("w-full h-auto object-contain", className)}
    alt="preview"
    {...props}
  />
);

export const PreviewName: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  children,
  ...props
}) => (
  <span className={cn("text-sm", className)} {...props}>
    {children}
  </span>
);

export const NewArticleButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => (
  <button
    className={cn(
      "cursor-pointer text-sm bg-blue-500 border border-blue-500 text-white px-4 py-2 hover:opacity-60",
      className,
    )}
    {...props}
  >
    <span>{children}</span>
  </button>
);
