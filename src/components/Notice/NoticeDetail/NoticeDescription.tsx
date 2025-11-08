import MarkdownRenderer from "@/components/common/Markdown/MarkdownRenderer";

type NoticeDescriptionProps = {
  description: string;
};

function NoticeDescription({ description }: NoticeDescriptionProps) {
  return (
    <div className="text-theme-default leading-[160%] whitespace-pre-wrap break-words break-keep">
      <MarkdownRenderer content={description} />
    </div>
  );
}

export default NoticeDescription;
