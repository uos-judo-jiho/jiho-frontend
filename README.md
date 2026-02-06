# Jiho Frontend Monorepo

This repository now hosts the public web experience and the standalone admin console as npm workspaces. The two apps share the same React component library so fixes and UI tweaks stay in sync.

## Packages

| Package | Path | Description |
| --- | --- | --- |
| `@uos-judo/web` | `packages/web` | Existing Express + Vite SSR app that powers https://uosjudo.com including the BFF middleware. |
| `@uos-judo/admin` | `packages/admin` | Static React build that renders the admin dashboard entirely on the client. It reuses the admin pages that live in the web package. |

## Install

```bash
npm install
```

## Common scripts

```bash
# Web (SSR)
npm run dev:web
npm run dev:server
npm run build:web
npm run start

# Admin (static)
npm run dev:admin
npm run build:admin
npm run preview:admin
```

`npm run build` runs both apps so you get `packages/web/build` for the SSR bundle and `packages/admin/dist` for the static dashboard artifacts (useful for CDN/S3 uploads).

## Deploying Admin

The admin build is completely static and can be served from any static host. Deploy the contents of `packages/admin/dist` to your preferred storage/CDN and point `/admin` DNS there (or configure the main server / CDN to rewrite `/admin` requests). The existing Express server no longer serves the admin bundle directly.

## Legacy docs

The original web README now lives in `packages/web/README.md` with all existing development details.
