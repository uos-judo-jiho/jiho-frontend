# Build stage - 빌드에 필요한 모든 dependencies 설치
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage - 애플리케이션 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments for environment variables
ARG VITE_INTERNAL_API_TOKEN
ARG BACKEND_URL
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_S3_BUCKET
ARG S3_UPLOAD_MAX_SIZE
ARG S3_ALLOWED_EXTENSIONS

# Set environment variables for build
ENV VITE_INTERNAL_API_TOKEN=$VITE_INTERNAL_API_TOKEN
ENV BACKEND_URL=$BACKEND_URL
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV AWS_S3_BUCKET=$AWS_S3_BUCKET
ENV S3_UPLOAD_MAX_SIZE=$S3_UPLOAD_MAX_SIZE
ENV S3_ALLOWED_EXTENSIONS=$S3_ALLOWED_EXTENSIONS

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application with environment variables
RUN npm run build

# Production stage - 런타임 dependencies만 설치
FROM node:20-alpine AS runner
WORKDIR /app

# Runtime environment variables (server-side only)
ARG INTERNAL_API_TOKEN
ARG PORT=3000
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_S3_BUCKET
ARG S3_UPLOAD_MAX_SIZE
ARG S3_ALLOWED_EXTENSIONS

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm install compression sirv cross-env && \
    npm cache clean --force

# Copy built application and server files
COPY --from=builder /app/build ./build
# COPY --from=builder /app/index.html ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set runtime environment variables
ENV NODE_ENV=production
ENV PORT=$PORT
ENV INTERNAL_API_TOKEN=$INTERNAL_API_TOKEN
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV AWS_S3_BUCKET=$AWS_S3_BUCKET
ENV S3_UPLOAD_MAX_SIZE=$S3_UPLOAD_MAX_SIZE
ENV S3_ALLOWED_EXTENSIONS=$S3_ALLOWED_EXTENSIONS

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:prod"]