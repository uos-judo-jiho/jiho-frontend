/**
 * 구조 스타일만. 패널의 색·모서리는 panelClassName 으로, 고른 줄의 배경은 --palette-highlight 로.
 * 기본 초기화는 :where() 로 감싸 넘겨받은 클래스가 항상 이긴다.
 */
export declare const root: string;
export declare const trigger: string;
/** 가장 가까운 position 이 있는 조상을 덮는다 */
export declare const layer: string;
/** 화면 전체 위 — 위쪽에 뜬다 */
export declare const layerFixed: string;
export declare const backdrop: string;
export declare const panel: string;
export declare const input: string;
export declare const list: string;
export declare const groupLabel: string;
export declare const option: string;
export declare const highlight: string;
export declare const label: string;
export declare const hint: string;
export declare const empty: string;
/** 검색어가 맞은 부분 — 기본은 굵게만 (색은 markClassName 이나 --palette-mark 로, 우선순위 0) */
export declare const mark: string;
