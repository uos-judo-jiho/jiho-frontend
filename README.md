# Jiho Frontend Monorepo

<div align="center" style="display: flex; gap: 0.5rem;">

[![CI](https://github.com/uos-judo-jiho/jiho-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/uos-judo-jiho/jiho-frontend/actions/workflows/ci.yml)

[![Build and Deploy (apps/Admin)](https://github.com/uos-judo-jiho/jiho-frontend/actions/workflows/deploy-admin.yml/badge.svg?branch=main)](https://github.com/uos-judo-jiho/jiho-frontend/actions/workflows/deploy-admin.yml)

[![Build and Deploy (apps/Web)](https://github.com/uos-judo-jiho/jiho-frontend/actions/workflows/deploy-web.yml/badge.svg?branch=main)](https://github.com/uos-judo-jiho/jiho-frontend/actions/workflows/deploy-web.yml)

</div>

</div>
This repository now hosts the public web experience and the standalone admin console as npm workspaces. The two apps share the same React component library so fixes and UI tweaks stay in sync.

## Apps

| Package           | Path         | Description                                                                                                              |
| ----------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `@uos-judo/web`   | `apps/web`   | Express + Vite SSR app that powers https://uosjudo.com including the BFF middleware.                                     |
| `@uos-judo/admin` | `apps/admin` | Static React build that renders the admin dashboard entirely on the client. It now carries its own copy of the admin UI. |

Reusable modules that both apps consume should live under `packages/*` (reserved for future shared packages).

## Install

```bash
pnpm install
```

## Common scripts

```bash
# Web (SSR)
pnpm dev:web
pnpm dev:server
pnpm build:web
pnpm start

# Admin (static)
pnpm dev:admin
pnpm build:admin
pnpm preview:admin
```

`pnpm build` runs both apps so you get `apps/web/build` for the SSR bundle and `apps/admin/dist` for the static dashboard artifacts (useful for CDN/S3 uploads).

## Release notes

릴리즈 노트는 앱별로 자동 발행된다. `apps/<app>/package.json` 의 `version` 을 올린 PR 이
`main` 에 머지되면 [`release-note.yml`](.github/workflows/release-note.yml) 이

1. 어떤 앱의 버전이 올라갔는지 감지하고,
2. 그 앱의 직전 릴리즈 태그(`<app>@<version>`, web 은 레거시 `v<version>` 까지 조회) 이후의
   squash 머지 커밋을 모아 Conventional Commits 타입별로 묶고,
3. `<app>@<version>` 태그로 GitHub Release 를 발행한다.

노트는 `apps/<app>/**` 를 건드린 **앱 변경**과 `packages/**`·루트 설정을 건드린
**공통 · 인프라 변경**으로 나뉘며, 그 사이에 만들어진 배포 태그
(`@uos-judo-jiho/<app>-...`, [`tag-release.yml`](.github/workflows/tag-release.yml))도 함께 접혀 들어간다.

발행 전에 로컬에서 미리 볼 수 있다.

```bash
# 현재 package.json 버전 기준으로 미리보기
pnpm release-note -- notes --app web

# 버전/비교 시작점을 직접 지정
pnpm release-note -- notes --app admin --version 0.2.0 --from admin@0.1.1

# 이번 커밋에서 버전이 올라간 앱 확인
pnpm release-note -- detect
```

이미 머지된 버전을 다시 발행하려면 Actions 에서 **Release Note** 워크플로우를
`app` / `version` / `from` 입력과 함께 수동 실행하면 된다.

## Deploying Admin

The admin build is completely static and can be served from any static host. Deploy the contents of `packages/admin/dist` to your preferred storage/CDN and point `/admin` DNS there (or configure the main server / CDN to rewrite `/admin` requests). The existing Express server no longer serves the admin bundle directly.

## Legacy docs

The original web README now lives in `apps/web/README.md` with all existing development details.
