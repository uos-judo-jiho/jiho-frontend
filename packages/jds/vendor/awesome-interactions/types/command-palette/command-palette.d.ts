import { type ReactNode } from "react";
export interface Command {
    id: string;
    label: string;
    /** 오른쪽에 흐리게 붙는 설명 (분류, 단축키 등) */
    hint?: string;
    /** label 에 없는 검색어 */
    keywords?: string[];
    /** 같은 group 끼리 제목 아래 묶인다 (처음 나온 순서대로) */
    group?: string;
}
interface CommandPaletteProps {
    commands: Command[];
    onRun: (command: Command) => void;
    /** 여는 버튼 내용 */
    trigger: ReactNode;
    /** 패널·입력칸 이름 (스크린 리더) */
    label?: string;
    placeholder?: string;
    /** 걸러진 결과가 없을 때 */
    emptyLabel?: string;
    /** 검색 방식 — 기본은 대소문자 무시 부분 일치(defaultMatch). 한글 초성 검색 등은 여기서 바꾼다 */
    match?: CommandMatcher;
    /** label 에서 맞은 부분(<mark>)의 모양 */
    markClassName?: string;
    /**
     * ⌘K / Ctrl+K 로 열기.
     * "global": 페이지 어디서나, "focus": 포커스가 이 컴포넌트 안에 있을 때만
     * (한 페이지에 여러 개가 있을 때), false: 버튼으로만.
     */
    hotkey?: "global" | "focus" | false;
    /**
     * true: 가장 가까운 position 이 있는 조상 안에 뜬다 (카드·데모 안)
     * false: 화면 전체 위에 뜬다 (페이지 헤더의 검색 등)
     */
    contained?: boolean;
    className?: string;
    panelClassName?: string;
}
/** 검색어가 맞은 결과 — 없으면(null) 목록에서 빠진다 */
export interface CommandMatch {
    /** label 안에서 맞은 구간 [시작, 끝) — 하이라이트한다 */
    ranges?: readonly (readonly [number, number])[];
    /** 클수록 같은 묶음 안에서 위로 (기본 0) */
    score?: number;
}
export type CommandMatcher = (command: Command, query: string) => CommandMatch | null;
/**
 * 기본 검색: 띄어 쓴 단어가 모두 label · hint · keywords 어딘가에 들어 있으면 맞다.
 * label 에서 맞은 곳을 하이라이트하고, label 이 검색어로 시작하면 > 단어 첫머리에서 맞으면 > 그 밖 순으로 위로 올린다.
 * 다른 언어(초성 검색 등)는 `match` prop 으로 바꾼다.
 */
export declare const defaultMatch: CommandMatcher;
/**
 * ⌘K 로 여는 명령 목록. 입력하면 걸러지고 ↑/↓ 로 고르고 Enter 로 실행한다.
 * 고른 줄의 배경은 layoutId 로 줄 사이를 미끄러진다.
 * 패널은 가장 가까운 position 이 있는 조상 안에 뜬다.
 */
export declare function CommandPalette({ commands, onRun, trigger, label, placeholder, emptyLabel, match, markClassName, hotkey, contained, className, panelClassName, }: CommandPaletteProps): import("react").JSX.Element;
export {};
