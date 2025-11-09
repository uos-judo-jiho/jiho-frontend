import { cn } from "@/lib/utils";
import { Constants } from "@/lib/constant";

type TitleProps = {
  title: string;
  color?: string;
  fontSize?: string;
  heading?: 1 | 2 | 3;
  className?: string;
};

function Title({
  title,
  color = "white",
  fontSize = Constants.TITLE_FONT_SIZE,
  heading = 1,
  className,
}: TitleProps) {
  const Tag = `h${heading}` as "h1" | "h2" | "h3";

  return (
    <Tag
      className={cn(
        "mb-5 break-keep",
        color === "white" ? "text-background" : "text-black",
        className
      )}
      style={{ fontSize }}
    >
      {title}
    </Tag>
  );
}

export default Title;
