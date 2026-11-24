/** 지금 Tab 으로 갈 수 있는 요소들 (보이지 않거나 inert 인 것은 뺀다) */
export declare function tabbables(root: HTMLElement): HTMLElement[];
/**
 * Tab 이 root 의 끝에 닿으면 반대쪽 끝으로 — 모달 밖으로 빠져나가지 않게.
 * keydown(Tab) 에서 부른다.
 */
export declare function trapTab(event: KeyboardEvent, root: HTMLElement): void;
