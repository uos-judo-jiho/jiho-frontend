#!/bin/bash
node script/sitemap.js

pnpm run clean
NODE_ENV=production pnpm run orval
pnpm run build:client
pnpm run build:server
pnpm run build:server-ts
pnpm run build:prerender
