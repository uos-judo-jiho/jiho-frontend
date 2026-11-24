/**
 * 구조 스타일만. 색·여백·모서리는 className / panelClassName 으로 준다.
 * 기본 초기화는 :where() 로 감싸 우선순위 0 — 넘겨받은 클래스가 항상 이긴다.
 * borderRadius 는 Motion 이 모핑 중 보정하므로 className 의 border-radius 를 그대로 쓴다.
 */
export declare const trigger: string;
export declare const content: string;
export declare const layerFixed: string;
export declare const layerContained: string;
export declare const backdrop: string;
export declare const panel: string;
export declare const close: string;
