#!/bin/bash

npm run clean &&\
npm run build:client &&\
npm run build:server &&\
node script/prerender-news.js