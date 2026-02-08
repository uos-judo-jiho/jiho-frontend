# UOS Judo Admin

Static React build that renders the admin dashboard UI. The codebase now lives entirely inside `apps/admin`, so it can evolve independently from the public web app.

## Scripts

```bash
yarn workspace @uos-judo/admin dev      # start Vite dev server on http://localhost:4175
yarn workspace @uos-judo/admin build    # output static assets to dist/
yarn workspace @uos-judo/admin preview  # preview production build locally
```

Run these commands from the repo root:

```bash
yarn dev:admin
yarn build:admin
yarn preview:admin
```

The build output in `dist/` can be uploaded to any CDN or object storage and then served behind `/admin`.
