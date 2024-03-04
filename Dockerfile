# build environment
FROM node:16.7-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . ./
CMD ["npm", "start"]