import React from "react";

export interface BaseSvgProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Accessible title for the SVG icon
   */
  title?: string;
  /**
   * Accessible description for the SVG icon
   */
  description?: string;
  /**
   * Size of the icon (width and height)
   */
  size?: string | number;
  /**
   * Color of the icon (fill or stroke)
   */
  color?: string;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether the icon is decorative only (no semantic meaning)
   * If true, aria-hidden will be set to true
   */
  decorative?: boolean;
}

/**
 * Base SVG Component with SEO and Accessibility features
 *
 * Features:
 * - ARIA labels for screen readers
 * - Semantic HTML with title and desc elements
 * - Keyboard navigation support
 * - Proper role attributes
 * - Decorative icon support
 *
 * @example
 * <BaseSvgComponent
 *   title="Close button"
 *   description="Click to close the modal"
 *   size={24}
 *   color="currentColor"
 * >
 *   <path d="..." />
 * </BaseSvgComponent>
 */
export const BaseSvgComponent: React.FC<
  BaseSvgProps & { children: React.ReactNode }
> = ({
  title,
  description,
  size,
  color,
  className,
  decorative = false,
  children,
  viewBox = "0 0 24 24",
  fill = "currentColor",
  xmlns = "http://www.w3.org/2000/svg",
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...props
}) => {
  // Generate unique IDs for title and description
  const titleId = React.useId();
  const descId = React.useId();

  // Determine ARIA attributes
  const shouldHaveRole = !decorative && !role;
  const computedRole = shouldHaveRole ? "img" : role;

  const computedAriaLabel = decorative ? undefined : ariaLabel || title;
  const computedAriaLabelledby = decorative
    ? undefined
    : ariaLabelledby || (title ? titleId : undefined);
  const computedAriaDescribedby = decorative
    ? undefined
    : ariaDescribedby || (description ? descId : undefined);

  return (
    <svg
      xmlns={xmlns}
      viewBox={viewBox}
      width={
        size !== undefined
          ? typeof size === "number"
            ? `${size}px`
            : size
          : undefined
      }
      height={
        size !== undefined
          ? typeof size === "number"
            ? `${size}px`
            : size
          : undefined
      }
      fill={color || fill}
      className={className}
      role={computedRole}
      aria-label={computedAriaLabel}
      aria-labelledby={computedAriaLabelledby}
      aria-describedby={computedAriaDescribedby}
      aria-hidden={decorative ? true : undefined}
      focusable={decorative ? false : undefined}
      {...props}
    >
      {title && <title id={titleId}>{title}</title>}
      {description && <desc id={descId}>{description}</desc>}
      {children}
    </svg>
  );
};

export default BaseSvgComponent;
