#!/bin/bash
# Watch mode for development with local prerendering



vite build --watch --mode=development --outDir build/client &\
vite build --ssr src/entry-server.tsx --watch --mode=development --outDir build/server &\
node script/prerender-news.js --local && cross-env NODE_ENV=production node server.js --local