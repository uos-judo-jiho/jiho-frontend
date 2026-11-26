/// <reference types="node" />
// CSS 를 파일로 읽어야 해서 이 파일에서만 node 타입을 들인다. `?raw` 는 쓸 수
// 없다 — Tailwind vite 플러그인이 CSS 를 가로채서 테스트에서 빈 문자열이 온다.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MarkdownEditor } from "./MarkdownEditor";

/** 에디터 안의 이미지 업로드 훅이 쿼리 클라이언트를 요구한다 */
const renderEditor = (value = "본문", props = {}) => {
  const onChange = vi.fn();

  render(
    <QueryClientProvider client={new QueryClient()}>
      <MarkdownEditor value={value} onChange={onChange} {...props} />
    </QueryClientProvider>,
  );

  return { onChange };
};

/**
 * 회귀 방지 — `.w-md-editor-text` 에 고정 높이를 주면 안 된다.
 *
 * 긴 글에서 "아래쪽을 눌러도 커서가 안 간다" 던 버그의 원인이다. 라이브러리는
 * 이 래퍼를 `min-height:100%` 로 두어 내용에 따라 자라게 하고, 입력 textarea 가
 * `position:absolute; height:100%` 로 그 위를 덮는다. 래퍼 높이를 고정하면
 * textarea 도 거기서 멈추는데, 그 아래로는 하이라이트 층
 * (`.w-md-editor-text-pre`, `pointer-events:none`)만 남아 클릭이 통과해 버린다.
 *
 * 스타일시트가 원인이라 DOM 으로는 잡을 수 없다 — happy-dom 은 외부 CSS 를
 * 적용하지 않아 computed style 이 비어 있다. 그래서 CSS 파일을 직접 읽어 막는다.
 */
describe("admin 전역 CSS", () => {
  it(".w-md-editor-text 에 height 를 주지 않는다", () => {
    // vitest 의 root 는 apps/admin 이다. import.meta.url 은 vite 모듈 URL 이라
    // file: 스킴이 아니어서 readFileSync 에 바로 넘길 수 없다
    const css = readFileSync(`${process.cwd()}/src/app/index.css`, "utf8");

    // 경로가 틀리거나 빈 문자열이 오면 이 테스트는 조용히 통과해 버린다.
    // 실제로 `?raw` 로 읽었을 때 빈 문자열이 와서 가드가 헛돌았다 — 그래서
    // 내용을 읽었다는 것부터 단정한다
    expect(css).toContain("markdown-editor-styles");

    const blocks = css.matchAll(
      /\.markdown-editor-styles\s+\.w-md-editor-text\s*\{([^}]*)\}/g,
    );

    for (const [, body] of blocks) {
      expect(body).not.toMatch(/(^|[^-])height\s*:/);
    }
  });
});

describe("MarkdownEditor", () => {
  it("타이핑한 내용을 그대로 올려 보낸다", async () => {
    const { onChange } = renderEditor("");

    await userEvent.type(screen.getByRole("textbox"), "가");

    expect(onChange).toHaveBeenCalledWith("가");
  });

  it("본문을 state 로 복사해 두지 않는다 — value 가 유일한 출처다", async () => {
    const { onChange } = renderEditor("처음");

    // 올려 보내도 부모가 value 를 바꾸지 않으면 화면도 바뀌지 않아야 한다
    await userEvent.type(screen.getByRole("textbox"), "!");

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveProperty("value", "처음");
  });

  it("글자 수를 보여준다", () => {
    renderEditor("열글자입니다!!");

    expect(screen.getByText("8자")).toBeTruthy();
  });

  describe("보기 모드", () => {
    const pressed = (name: string) =>
      screen.getByRole("button", { name }).getAttribute("aria-pressed");

    it("실시간 프리뷰로 시작한다", () => {
      renderEditor();

      expect(pressed("실시간 프리뷰")).toBe("true");
    });

    it("버튼으로 바꾸면 눌린 상태가 옮겨간다", async () => {
      renderEditor();

      await userEvent.click(screen.getByRole("button", { name: "편집" }));

      expect(pressed("편집")).toBe("true");
      expect(pressed("실시간 프리뷰")).toBe("false");
    });
  });

  it("disabled 면 입력 없이 렌더만 한다", () => {
    renderEditor("읽기 전용", { disabled: true });

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.getByText("5자")).toBeTruthy();
  });
});
