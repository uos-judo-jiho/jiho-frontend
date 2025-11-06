#!/bin/bash
node script/sitemap.js

npm run clean
npm run build:client
npm run build:server