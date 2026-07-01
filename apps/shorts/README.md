# 지호 쇼츠 (apps/shorts)

UOS 유도부 하이라이트 클립을 **쇼츠 스타일 스와이프**로 빠르게 라벨링하는 PWA입니다.
가로/세로 모드를 지원하며, 홈 화면에 설치해 네이티브 앱처럼 사용할 수 있습니다.

- 배포 주소: https://shorts.uosjudo.com
- 스택: React 18 · Vite · TailwindCSS v4 · TanStack Query · `vite-plugin-pwa`

## 조작 방법

| 제스처 | 동작 |
| --- | --- |
| 오른쪽 스와이프 👉 | 득점 (SUCCESS / WAZA_ARI) |
| 왼쪽 스와이프 👈 | 무효 (NONE) |
| 두 번 탭 | 좋아요 |
| 한 번 탭 | 일시정지 / 재생 |
| 우측 상단 토글 | 가로 ↔ 세로 모드 전환 |

- 스와이프하는 동안 손가락을 따라 **무효/득점 스탬프**가 실시간으로 나타납니다.
- 이미 라벨링한 클립은 **좌우 어느 쪽으로 스와이프해도 다음으로** 넘어갑니다.

---

## PWA 초기 세팅 가이드

### 1. 사전 준비물

- Node.js 20+ (권장: 24)
- pnpm 9 (`corepack enable` 후 `corepack use pnpm@9`)
- 저장소 루트에서 의존성 설치:

```bash
pnpm install
```

### 2. 로컬 개발 서버

```bash
# 저장소 루트에서
pnpm dev:shorts
# 또는
pnpm -C apps/shorts dev
```

- 개발 서버: http://localhost:3002
- `/api` 요청은 `https://api.uosjudo.com` 으로 프록시됩니다
  (`VITE_API_PROXY_TARGET` 로 대상 변경 가능).
- 백엔드 인증 쿠키의 `Secure` / `Domain` / `SameSite=None` 속성을 로컬에서
  쓸 수 있도록 프록시가 자동으로 완화합니다 (`vite.config.ts` 참고).
- 데이터가 안 보이면 `https://admin.uosjudo.com/login` 에서 먼저 로그인하세요.

### 3. 아이콘

`public/icons/` 에 UOS 유도부 로고 기반 아이콘이 준비되어 있습니다
(어두운 테마 배경 + 흰색 엠블럼 + 인디고 글로우).

| 파일 | 크기 | 용도 |
| --- | --- | --- |
| `icon-192.png` | 192×192 | 홈 화면 / apple-touch 아이콘 |
| `icon-512.png` | 512×512 | 스플래시 / 고해상도 |
| `icon-512-maskable.png` | 512×512 | Android 마스커블 (안전영역 여백 포함) |

로고를 교체하려면 흰색 투명 로고를 소스로 다시 합성하면 됩니다.
`sharp` 로 어두운 라운드 배경 위에 로고를 중앙 배치해 생성했습니다
(소스 로고: `apps/web/src/shared/lib/assets/images/logo/logo-removebg-white.webp`).

### 4. 프로덕션 빌드 & 로컬 검증

PWA(서비스 워커·매니페스트)는 **빌드 결과물에서만** 동작하므로, dev 서버가 아니라
빌드 후 preview로 확인해야 합니다.

```bash
pnpm -C apps/shorts build      # dist/ 에 sw.js, manifest, precache 생성
pnpm -C apps/shorts preview    # http://localhost:3003 에서 설치 가능 상태로 확인
```

브라우저 DevTools → Application 탭에서 확인:

- **Manifest**: 이름/아이콘/`orientation: any` 가 로드되는지
- **Service Workers**: `sw.js` 가 `activated` 상태인지
- **Lighthouse → PWA**: "Installable" 통과 여부

### 5. 기기에 설치하기

- **iOS (Safari)**: 공유 버튼 → "홈 화면에 추가"
- **Android (Chrome)**: 주소창의 설치 아이콘 또는 메뉴 → "앱 설치"
- 설치 후에는 주소창 없이 전체 화면(standalone)으로 실행됩니다.
- 방향은 고정하지 않으므로(`orientation: "any"`), 앱 내 토글로 가로/세로를 전환합니다.

### 6. 업데이트 동작

- `registerType: "autoUpdate"` 설정으로 새 배포 감지 시 서비스 워커가 자동 갱신됩니다.
- 사용자가 앱을 껐다 켜면 최신 버전이 적용됩니다.
- API 응답은 `NetworkFirst` (60초 캐시)로 처리되어 오프라인에서도 마지막 데이터를 볼 수 있습니다.

---

## 배포

`main` 브랜치에 `apps/shorts/**` 변경이 푸시되면
`.github/workflows/deploy-shorts.yml` 이 빌드 후 SSH로 배포합니다.

```bash
pnpm orval          # @packages/api 코드 생성
pnpm build:shorts   # tsc -b && vite build → dist/
# scripts/deploy-shorts.sh 가 dist/ 를 서버로 전송
```

## 참고 파일

- `src/pages/shorts-page.tsx` — 화면/네비게이션/방향 토글
- `src/components/shorts-card.tsx` — 클립 카드 · 스와이프 저장
- `src/components/swipe-feedback.tsx` — 실시간 드래그 스탬프 · 결과 피드백
- `src/hooks/use-swipe.ts` — 스와이프/드래그/탭 제스처 판정
- `src/hooks/use-orientation.ts` — 가로/세로 모드 상태
- `vite.config.ts` — PWA 매니페스트 · 서비스 워커 · 프록시 설정
