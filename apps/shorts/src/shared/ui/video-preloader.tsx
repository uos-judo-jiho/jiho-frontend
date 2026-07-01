/**
 * 다음 N개 클립 URL을 숨겨진 <video preload="auto"> 로 미리 버퍼링한다.
 * display:none 은 일부 브라우저에서 버퍼링을 막으므로 시각적으로만 숨긴다.
 */
interface Props {
  urls: string[];
}

export const VideoPreloader = ({ urls }: Props) => (
  <div
    aria-hidden="true"
    style={{
      position: "fixed",
      width: 1,
      height: 1,
      overflow: "hidden",
      opacity: 0,
      pointerEvents: "none",
      zIndex: -1,
    }}
  >
    {urls.map((url) => (
      <video key={url} src={url} preload="auto" muted playsInline />
    ))}
  </div>
);
