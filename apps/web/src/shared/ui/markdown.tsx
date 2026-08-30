import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/shared/lib/utils";

type MarkdownProps = {
  content: string;
  className?: string;
};

/**
 * 본문 마크다운 렌더러.
 *
 * 이전 구현은 스타일을 전부 `[&>h1]` 같은 직계 자식 선택자로 걸어서, 목록 안의
 * 문단이나 blockquote 안의 텍스트처럼 한 단계라도 중첩된 요소에는 아무 스타일도
 * 닿지 않았다. 여기서는 자손 선택자(`[&_h1]`)로 바꾸고 색·간격은 전부 토큰에서 가져온다.
 */
export const Markdown = ({ content, className }: MarkdownProps) => (
  <div
    className={cn(
      "text-body text-ink",
      // 제목
      "[&_h1]:mt-10 [&_h1]:mb-3 [&_h1]:text-heading [&_h1]:text-ink-strong",
      "[&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-subheading [&_h2]:text-ink-strong",
      "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-lead [&_h3]:font-bold",
      "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-bold",
      "[&_:is(h1,h2,h3,h4,h5,h6):first-child]:mt-0",
      // 본문
      "[&_p]:my-4 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
      // 목록
      "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
      "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
      "[&_li]:my-1 [&_li]:pl-1 [&_li::marker]:text-ink-faint",
      // 인용
      "[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-accent",
      "[&_blockquote]:pl-4 [&_blockquote]:text-ink-muted",
      // 코드
      "[&_code]:rounded-xs [&_code]:bg-surface-subtle [&_code]:px-1.5 [&_code]:py-0.5",
      "[&_code]:font-mono [&_code]:text-[0.9em]",
      "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface-subtle [&_pre]:p-4",
      "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
      // 링크
      "[&_a]:font-medium [&_a]:text-accent-strong [&_a]:underline [&_a]:underline-offset-2",
      "[&_a]:decoration-accent/50 hover:[&_a]:decoration-accent-strong",
      // 표
      "[&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-caption",
      "[&_th]:border-b [&_th]:border-line-strong [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
      "[&_td]:border-b [&_td]:border-line-subtle [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
      // 기타
      "[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-line",
      "[&_img]:my-5 [&_img]:rounded-md",
      "[&_strong]:font-bold [&_strong]:text-ink-strong",
      "[&_em]:italic",
      className,
    )}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ href, children, ...props }) => {
          const external = href?.startsWith("http");
          return (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
