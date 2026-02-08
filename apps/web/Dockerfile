# Build stage - install monorepo dependencies with pnpm
FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/api/package.json packages/api/package.json
RUN pnpm install --frozen-lockfile

# Build stage - 애플리케이션 빌드
FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable

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

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

# Build the application with environment variables
RUN pnpm -C packages/api generate
RUN pnpm -C apps/web build

# Production stage - 런타임 dependencies만 설치
FROM node:20-alpine AS runner
WORKDIR /repo
RUN corepack enable

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
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/api/package.json packages/api/package.json
RUN pnpm install --frozen-lockfile --prod --filter @apps/web...

# Copy built application and server files
COPY --from=builder /repo/apps/web/build ./apps/web/build
# COPY --from=builder /app/index.html ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /repo
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
CMD ["pnpm", "-C", "apps/web", "start:prod"]