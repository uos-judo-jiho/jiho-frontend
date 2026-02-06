#!/bin/bash
node script/sitemap.js

npm run clean
npm run orval
npm run build:client
npm run build:server
npm run build:server-ts
npm run build:prerender