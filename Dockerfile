# build environment
FROM node:16.7-alpine AS base
WORKDIR /app
COPY package*.json ./
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
RUN npm install --silent
COPY . ./
CMD ["npm", "run", "start:prod:ssr"]