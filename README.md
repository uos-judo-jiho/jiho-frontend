# Jiho Frontend Monorepo

This repository now hosts the public web experience and the standalone admin console as npm workspaces. The two apps share the same React component library so fixes and UI tweaks stay in sync.

## Apps

| Package | Path | Description |
| --- | --- | --- |
| `@uos-judo/web` | `apps/web` | Express + Vite SSR app that powers https://uosjudo.com including the BFF middleware. |
| `@uos-judo/admin` | `apps/admin` | Static React build that renders the admin dashboard entirely on the client. It now carries its own copy of the admin UI. |

Reusable modules that both apps consume should live under `packages/*` (reserved for future shared packages).

## Install

```bash
yarn install
```

## Common scripts

```bash
# Web (SSR)
yarn dev:web
yarn dev:server
yarn build:web
yarn start

# Admin (static)
yarn dev:admin
yarn build:admin
yarn preview:admin
```

`yarn build` runs both apps so you get `apps/web/build` for the SSR bundle and `apps/admin/dist` for the static dashboard artifacts (useful for CDN/S3 uploads).

## Deploying Admin

The admin build is completely static and can be served from any static host. Deploy the contents of `packages/admin/dist` to your preferred storage/CDN and point `/admin` DNS there (or configure the main server / CDN to rewrite `/admin` requests). The existing Express server no longer serves the admin bundle directly.

## Legacy docs

The original web README now lives in `apps/web/README.md` with all existing development details.
