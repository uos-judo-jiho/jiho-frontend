import type { ComponentType, LazyExoticComponent } from "react";
export type InteractionCategory = "cursor" | "scroll" | "hover" | "text" | "layout" | "gesture";
/**
 * 갤러리 조절기로 노출할 숫자 prop.
 * `kind: "toggle"` 이면 체크박스로 표시하고 값은 0/1 (min/max/step 은 무시).
 */
export interface NumberControl {
    label: string;
    kind?: "range" | "toggle";
    min: number;
    max: number;
    step: number;
    default: number;
    /** 값 뒤에 붙일 단위 (표시용) */
    unit?: string;
}
/** prop 이름 → 조절기 정의 */
export type InteractionControls = Record<string, NumberControl>;
export type ControlValues = Record<string, number>;
export interface InteractionMeta {
    /** URL slug — 폴더 이름과 동일하게 */
    slug: string;
    title: string;
    description: string;
    category: InteractionCategory;
    tags?: string[];
    /**
     * 갤러리에 "다시 보기" 버튼을 노출할지 (기본 true).
     * 등장 애니메이션처럼 한 번 재생되는 인터랙션은 true,
     * hover·pointer 처럼 사용자가 직접 계속 조작하는 인터랙션은 false.
     */
    replayable?: boolean;
    /** 모달에서 조절할 수 있는 props. 데모는 이 키들을 props 로 받는다 */
    controls?: InteractionControls;
}
/**
 * 레지스트리 항목 — `meta.ts` 는 바로 읽고, 데모(`demo.tsx`)는 처음 렌더될 때 불러온다.
 * `default` 는 React.lazy 컴포넌트라 <Suspense> 안에서 렌더해야 한다.
 */
export interface InteractionDemoModule {
    meta: InteractionMeta;
    /** controls 의 현재 값이 props 로 전달된다 */
    default: LazyExoticComponent<ComponentType<ControlValues>>;
}
export interface SourceFile {
    /** 폴더 기준 파일 이름 (예: TiltCard.tsx) */
    name: string;
    code: string;
}
