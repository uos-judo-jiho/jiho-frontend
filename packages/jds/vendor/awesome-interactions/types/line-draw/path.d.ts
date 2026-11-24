/**
 * 점들을 지나는 부드러운 곡선 (Catmull-Rom → 3차 베지어).
 * d3 없이 path 문자열만 만든다.
 */
export declare function smoothPath(points: readonly (readonly [number, number])[], tension?: number): string;
