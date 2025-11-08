import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import styled from "styled-components";

const MarkdownContainer = styled.div`
  font-size: ${(props) => props.theme.defaultFontSize};
  line-height: 1.6;

  /* Markdown 스타일링 */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.3em;
  }
  h3 {
    font-size: 1.1em;
  }

  p {
    margin-bottom: 1em;
    text-indent: 0.4em;
  }

  ul,
  ol {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.3em;
  }

  blockquote {
    border-left: 4px solid ${(props) => props.theme.lightGreyColor || "#ddd"};
    margin: 1em 0;
    padding-left: 1em;
    font-style: italic;
    color: ${(props) => props.theme.greyColor || "#666"};
  }

  code {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1em 0;
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  a {
    color: ${(props) => props.theme.primaryColor || "#007bff"};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th,
  td {
    border: 1px solid ${(props) => props.theme.lightGreyColor || "#ddd"};
    padding: 0.5em;
    text-align: left;
  }

  th {
    background-color: #f9f9f9;
    font-weight: bold;
  }

  hr {
    border: none;
    border-top: 1px solid ${(props) => props.theme.lightGreyColor || "#ddd"};
    margin: 1.5em 0;
  }

  /* 첫 번째 단락의 text-indent 제거 (제목 바로 다음) */
  h1 + p,
  h2 + p,
  h3 + p,
  h4 + p,
  h5 + p,
  h6 + p {
    text-indent: 0;
  }
`;

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <MarkdownContainer className={className}>
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
    </MarkdownContainer>
  );
};

export default MarkdownRenderer;
