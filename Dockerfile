# build environment
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
RUN npm install --silent --force
COPY . ./
CMD ["npm", "run", "start:prod"]