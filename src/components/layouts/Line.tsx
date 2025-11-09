import { cn } from "@/lib/utils";

type LineProps = {
  width?: string;
  margin?: string;
  borderWidth?: string;
  borderColor?: string;
  className?: string;
};

function Line({
  width = "100%",
  margin = "auto",
  borderColor = "",
  borderWidth = "2px",
  className,
}: LineProps) {
  return (
    <hr
      className={cn("origin-right", className)}
      style={{
        width,
        margin,
        border: `${borderWidth} solid ${borderColor || "hsl(var(--muted)"}`,
      }}
    />
  );
}

export default Line;
