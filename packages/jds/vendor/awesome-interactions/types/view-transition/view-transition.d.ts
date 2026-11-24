/**
 * 브라우저 네이티브 View Transitions API 로 상태 변경을 감싼다.
 * 변경 전후 화면을 브라우저가 찍어, `view-transition-name` 이 같은 요소끼리 위치·크기를 모핑한다.
 * API 가 없거나(구형 브라우저) 동작 줄이기 설정이면 그냥 바로 바꾼다.
 */
export declare function useViewTransition(duration?: number): (update: () => void) => void;
/**
 * 인스턴스마다 겹치지 않는 view-transition-name 을 만든다.
 * 같은 이름이 한 화면에 둘 있으면 전환이 실패하므로(예: 카드와 모달에 같은 데모) useId 로 구분한다.
 */
export declare function useTransitionName(): (key: string) => string;
