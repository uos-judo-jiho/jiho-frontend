#!/bin/bash
set -e

node script/sitemap.js

pnpm run clean
NODE_ENV=production pnpm run orval
pnpm run build:vite
