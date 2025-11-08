import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import styled from "styled-components";

const HelpContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  h3.help-title {
    color: #0969da;
    margin: 1.5rem 0 0.5rem 0;
    font-weight: 600;
    font-size: 16px;
  }

  h3:first-child {
    margin-top: 0;
  }

  p {
    margin: 0.8rem 0;
    color: #1f2328;
  }

  .example-section {
    background-color: #f6f8fa;
    border: 1px solid #d1d9e0;
    border-radius: 6px;
    padding: 1rem;
    margin: 0.8rem 0;
  }

  .markdown-input {
    background-color: #ffffff;
    border: 1px solid #d1d9e0;
    border-radius: 4px;
    padding: 0.5rem;
    margin: 0.5rem 0;
    font-family:
      "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 12px;
    color: #cf222e;
  }

  .markdown-output {
    background-color: #ffffff;
    border: 1px solid #d1d9e0;
    border-radius: 4px;
    padding: 0.5rem;
    margin: 0.5rem 0;

    h1,
    h2 {
      border-bottom: 1px solid hsl(210, 18%, 87%);
      padding-bottom: 0.3em;
      margin-top: 1.5em;
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.25em;
    }
    h4 {
      font-size: 1em;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0.5rem 0;
      font-weight: bold;
    }

    p {
      margin: 0.5rem 0;
    }

    ul,
    ol {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    blockquote {
      border-left: 4px solid #d1d9e0;
      margin: 0.5rem 0;
      padding-left: 1rem;
      color: #656d76;
      font-style: italic;
    }

    code {
      background-color: rgba(175, 184, 193, 0.2);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family:
        "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 11px;
    }

    pre {
      background-color: #f6f8fa;
      padding: 0.8rem;
      border-radius: 4px;
      overflow-x: auto;
      margin: 0.5rem 0;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.5rem 0;
      font-size: 12px;
    }

    th,
    td {
      border: 1px solid #d1d9e0;
      padding: 0.3rem;
      text-align: left;
    }

    th {
      background-color: #f6f8fa;
      font-weight: bold;
    }

    a {
      color: #0969da;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .tip-box {
    background-color: #dbeafe;
    border: 1px solid #3b82f6;
    border-radius: 6px;
    padding: 1rem;
    margin: 1rem 0;
    color: #1e40af;
  }

  .tip-box strong {
    color: #1e3a8a;
  }
`;

export const HelpMarkdown = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <HelpCircle className="w-4 h-4 mr-2" />
          마크다운 사용법
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>마크다운 사용법 가이드</DialogTitle>
        </DialogHeader>

        <HelpContent>
          <div className="tip-box">
            <strong>💡 팁:</strong> 아래 예시들을 복사해서 에디터에 붙여넣고
            실시간 프리뷰로 결과를 확인해보세요!
          </div>

          <h3 className="help-title">📝 제목 (Headers)</h3>
          <p>
            제목을 만들 때는 <code>#</code>을 사용합니다. <code>#</code>의
            개수에 따라 제목 크기가 달라집니다.
          </p>
          <div className="example-section">
            <div className="markdown-input">
              # 가장 큰 제목 (H1)
              <br />
              ## 두 번째 제목 (H2)
              <br />
              ### 세 번째 제목 (H3)
              <br />
              #### 네 번째 제목 (H4)
            </div>
            <div className="markdown-output">
              <h1>가장 큰 제목 (H1)</h1>
              <h2>두 번째 제목 (H2)</h2>
              <h3>세 번째 제목 (H3)</h3>
              <h4>네 번째 제목 (H4)</h4>
            </div>
          </div>

          <h3 className="help-title">✨ 텍스트 스타일링</h3>
          <p>텍스트를 굵게, 기울임꼴, 취소선으로 꾸밀 수 있습니다.</p>
          <div className="example-section">
            <div className="markdown-input">
              **굵은 글씨**
              <br />
              *기울임꼴*
              <br />
              ~~취소선~~
              <br />
              `인라인 코드`
            </div>
            <div className="markdown-output">
              <p>
                <strong>굵은 글씨</strong>
              </p>
              <p>
                <em>기울임꼴</em>
              </p>
              <p>
                <s>취소선</s>
              </p>
              <p>
                <code>인라인 코드</code>
              </p>
            </div>
          </div>

          <h3 className="help-title">📋 목록 (Lists)</h3>
          <p>순서가 있는 목록과 순서가 없는 목록을 만들 수 있습니다.</p>
          <div className="example-section">
            <div className="markdown-input">
              - 순서 없는 목록 1<br />
              - 순서 없는 목록 2<br />
              &nbsp;&nbsp;- 하위 목록
              <br />
              <br />
              1. 순서 있는 목록 1<br />
              2. 순서 있는 목록 2<br />
              &nbsp;&nbsp;&nbsp;1. 하위 목록
            </div>
            <div className="markdown-output">
              <ul>
                <li>순서 없는 목록 1</li>
                <li>
                  순서 없는 목록 2
                  <ul>
                    <li>하위 목록</li>
                  </ul>
                </li>
              </ul>
              <ol>
                <li>순서 있는 목록 1</li>
                <li>
                  순서 있는 목록 2
                  <ol>
                    <li>하위 목록</li>
                  </ol>
                </li>
              </ol>
            </div>
          </div>

          <h3 className="help-title">🔗 링크와 이미지</h3>
          <p>링크와 이미지를 삽입할 수 있습니다.</p>
          <div className="example-section">
            <div className="markdown-input">
              [링크 텍스트](https://example.com)
              <br />
              ![이미지 설명](https://picsum.photos/200)
            </div>
            <div className="markdown-output">
              <p>
                <a href="https://example.com">링크 텍스트</a>
              </p>
              <p>
                <img
                  src="https://picsum.photos/200"
                  alt="이미지 설명"
                  style={{ maxWidth: "150px" }}
                />
              </p>
            </div>
          </div>

          <h3 className="help-title">💬 인용구 (Blockquotes)</h3>
          <p>인용구나 강조하고 싶은 내용을 표시할 때 사용합니다.</p>
          <div className="example-section">
            <div className="markdown-input">
              &gt; 이것은 인용구입니다.
              <br />
              &gt; 여러 줄로 작성할 수 있습니다.
            </div>
            <div className="markdown-output">
              <blockquote>
                <p>
                  이것은 인용구입니다.
                  <br />
                  여러 줄로 작성할 수 있습니다.
                </p>
              </blockquote>
            </div>
          </div>

          <h3 className="help-title">💻 코드 블록</h3>
          <p>프로그래밍 코드나 명령어를 예쁘게 표시할 수 있습니다.</p>
          <div className="example-section">
            <div className="markdown-input">
              ```javascript
              <br />
              function hello() &#123;
              <br />
              &nbsp;&nbsp;console.log('Hello, World!');
              <br />
              &#125;
              <br />
              ```
            </div>
            <div className="markdown-output">
              <pre>
                <code>
                  function hello() {"{"}
                  console.log('Hello, World!');
                  {"}"}
                </code>
              </pre>
            </div>
          </div>

          <h3 className="help-title">📊 표 (Tables)</h3>
          <p>데이터를 정리해서 보여줄 때 유용합니다.</p>
          <div className="example-section">
            <div className="markdown-input">
              | 제목1 | 제목2 | 제목3 |<br />
              |-------|-------|-------|
              <br />
              | 내용1 | 내용2 | 내용3 |<br />| 내용4 | 내용5 | 내용6 |
            </div>
            <div className="markdown-output">
              <table>
                <thead>
                  <tr>
                    <th>제목1</th>
                    <th>제목2</th>
                    <th>제목3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>내용1</td>
                    <td>내용2</td>
                    <td>내용3</td>
                  </tr>
                  <tr>
                    <td>내용4</td>
                    <td>내용5</td>
                    <td>내용6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="help-title">🖼️ 이미지 업로드</h3>
          <p>이미지 파일을 에디터에 직접 드래그해서 올릴 수 있습니다.</p>
          <div className="tip-box">
            <strong>이미지 업로드 방법:</strong>
            <br />
            1. 컴퓨터에서 이미지 파일을 선택
            <br />
            2. 마크다운 에디터 영역으로 드래그해서 드롭
            <br />
            3. 자동으로 업로드되고 마크다운 코드가 삽입됩니다
          </div>

          <h3 className="help-title">⚡ 추가 팁</h3>
          <ul>
            <li>
              <strong>줄 바꿈:</strong> 문단을 나누려면 한 줄을 완전히
              비워두세요
            </li>
            <li>
              <strong>실시간 프리뷰:</strong> "실시간 프리뷰" 모드에서 작성과
              결과를 동시에 확인하세요
            </li>
            <li>
              <strong>복사 붙여넣기:</strong> 다른 곳에서 작성한 마크다운을
              복사해서 붙여넣을 수 있습니다
            </li>
            <li>
              <strong>자동 저장:</strong> 작성 중인 내용은 자동으로 임시
              저장됩니다
            </li>
          </ul>
        </HelpContent>
      </DialogContent>
    </Dialog>
  );
};
