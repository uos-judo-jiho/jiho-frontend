import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div
      className={cn(
        "text-theme-default leading-relaxed",
        // Headings
        "[&>h1]:mt-6 [&>h1]:mb-1 [&>h1]:font-bold [&>h1]:text-[1.5em]",
        "[&>h2]:mt-6 [&>h2]:mb-1 [&>h2]:font-bold [&>h2]:text-[1.3em]",
        "[&>h3]:mt-6 [&>h3]:mb-1 [&>h3]:font-bold [&>h3]:text-[1.1em]",
        "[&>h4]:mt-6 [&>h4]:mb-1 [&>h4]:font-bold",
        "[&>h5]:mt-6 [&>h5]:mb-1 [&>h5]:font-bold",
        "[&>h6]:mt-6 [&>h6]:mb-1 [&>h6]:font-bold",
        // Paragraphs
        "[&>p]:mb-2 [&>p]:indent-[0.4em]",
        "[&>h1+p]:indent-0 [&>h2+p]:indent-0 [&>h3+p]:indent-0",
        "[&>h4+p]:indent-0 [&>h5+p]:indent-0 [&>h6+p]:indent-0",
        // Lists
        "[&>ul]:mb-2 [&>ul]:pl-6 [&>ul]:list-disc",
        "[&>ol]:mb-2 [&>ol]:pl-6 [&>ol]:list-decimal",
        "[&>li]:mb-[0.3em]",
        // Blockquote
        "[&>blockquote]:border-l-4 [&>blockquote]:border-theme-light-grey",
        "[&>blockquote]:my-2 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-theme-grey",
        // Code
        "[&>code]:bg-[#f5f5f5] [&>code]:px-[0.4em] [&>code]:py-[0.2em]",
        "[&>code]:rounded [&>code]:font-mono [&>code]:text-[0.9em]",
        "[&>pre]:bg-[#f5f5f5] [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>pre]:my-2",
        "[&>pre_code]:bg-transparent [&>pre_code]:p-0",
        // Text formatting
        "[&>strong]:font-bold",
        "[&>em]:italic",
        // Links
        "[&>a]:text-theme-primary [&>a]:no-underline hover:[&>a]:underline",
        // Tables
        "[&>table]:border-collapse [&>table]:w-full [&>table]:my-2",
        "[&>th]:border [&>th]:border-theme-light-grey [&>th]:p-2 [&>th]:text-left [&>th]:bg-[#f9f9f9] [&>th]:font-bold",
        "[&>td]:border [&>td]:border-theme-light-grey [&>td]:p-2 [&>td]:text-left",
        // Horizontal rule
        "[&>hr]:border-0 [&>hr]:border-t [&>hr]:border-theme-light-grey [&>hr]:my-2",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // 외부 링크는 새 탭에서 열기
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          // ul, li에 마커 스타일 추가
          ul: ({ children, ...props }) => (
            <ul
              style={{ listStyleType: "disc", paddingLeft: "1.5em" }}
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              style={{ listStyleType: "decimal", paddingLeft: "1.5em" }}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li style={{ marginBottom: "0.3em" }} {...props}>
              {children}
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
