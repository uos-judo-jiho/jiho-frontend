import { useEffect, useState } from "react";

/** Chrome/Edge/삼성 인터넷이 발생시키는 beforeinstallprompt 이벤트. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// beforeinstallprompt는 리액트 마운트 전에 발생할 수 있어, 모듈 로드 시점부터
// 전역에서 가로채 저장해 둔다(preventDefault로 브라우저 기본 배너는 억제).
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

const notify = () => listeners.forEach((l) => l(deferredPrompt));

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

/**
 * prompt()는 1회용 — 호출 후 저장된 이벤트를 비워 중복 트리거(재사용 시 예외)를 막는다.
 * 설치 시트를 한 번 띄운 뒤 반드시 호출한다.
 */
export const consumeInstallPrompt = () => {
  deferredPrompt = null;
  notify();
};

/**
 * 네이티브 설치 프롬프트를 지원하는 브라우저에서 캡처한 이벤트를 반환한다.
 * 이벤트가 있으면 `prompt()`를 호출해 바로 설치 시트를 띄울 수 있다.
 * 미지원(iOS/삼성 일부/인앱)에서는 null이며, 수동 안내로 대체한다.
 */
export const useBeforeInstallPrompt = (): BeforeInstallPromptEvent | null => {
  const [prompt, setPrompt] = useState(deferredPrompt);

  useEffect(() => {
    const listener = (e: BeforeInstallPromptEvent | null) => setPrompt(e);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return prompt;
};
