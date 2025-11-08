#!/bin/bash
# Watch mode for development with local prerendering

vite build --watch --mode=development --outDir build/client &\
vite build --ssr src/entry-server.tsx --watch --mode=development --outDir build/server &\
cross-env NODE_ENV=production node build/server-ts/index.js