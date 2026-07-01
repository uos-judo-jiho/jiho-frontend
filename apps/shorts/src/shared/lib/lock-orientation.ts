/**
 * 물리 화면 방향을 세로로 고정 시도(best-effort).
 *
 * 앱은 가로 모드를 CSS 90° 회전으로 직접 구현하므로, OS 자동회전으로 뷰포트가
 * 함께 돌면 이중 회전이 된다. 이를 막기 위해 세로로 잠근다.
 *
 * - 설치된 PWA(standalone)·전체화면: Screen Orientation API로 잠금 성공.
 * - 일반 브라우저 탭: 잠금이 허용되지 않아(NotSupported/보안) 조용히 무시된다.
 *   (설치 PWA는 매니페스트 orientation:"portrait"로도 함께 강제된다.)
 */
export const lockPortrait = () => {
  if (typeof screen === "undefined") return;
  const orientation = screen.orientation as ScreenOrientation & {
    lock?: (orientation: "portrait") => Promise<void>;
  };
  try {
    void orientation?.lock?.("portrait").catch(() => {});
  } catch {
    // 미지원 브라우저 — 무시.
  }
};
