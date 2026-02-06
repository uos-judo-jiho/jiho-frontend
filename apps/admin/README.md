# UOS Judo Admin

Static React build that renders the admin dashboard UI using the shared components from `@uos-judo/web`.

## Scripts

```bash
npm run dev      # start Vite dev server on http://localhost:4175
npm run build    # output static assets to dist/
npm run preview  # preview production build locally
```

Run these commands from the repo root:

```bash
npm run dev:admin
npm run build:admin
npm run preview:admin
```

The build output in `dist/` can be uploaded to any CDN or object storage and then served behind `/admin`.
