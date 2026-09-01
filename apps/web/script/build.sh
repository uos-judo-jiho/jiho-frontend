#!/bin/bash
set -e

node script/sitemap.js

pnpm run clean
NODE_ENV=production pnpm run orval

# 워크스페이스 의존 패키지(@packages/*)를 tsdown 으로 먼저 빌드한다.
# 프로덕션 빌드는 exports 의 dist 엔트리를 타므로 vite build 보다 앞서야 한다.
pnpm run build:deps

pnpm run build:vite
