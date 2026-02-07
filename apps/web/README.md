# 서울시립대학교 유도부 지호 UOS Judo Time Jiho

[유도부 홈페이지 링크](https://uosjudo.com)

[API 명세서](https://uosjudo.com/api/docs)

# 주요 페이지

### 메인 페이지

유도부 소개, 지호지 링크, 훈련일지 링크, 공지사항 링크를 제공합니다.

### 공지사항

공지사항을 작성합니다.

### 훈련 일지

정기 운동 후 훈련에 대한 일지를 작성합니다.

### 지호지

매년 발생한 소식을 안내합니다.

### 관리자

훈련 일지, 지호지, 공지사항을 작성합니다.

# 개발 환경

```bash
Ubuntu Linux 20.04.
Node 18.x
```

# Install instruction

1. install dependency

```bash
yarn install
```

2. dev run

```bash
yarn workspace @uos-judo/web dev
```

3. dev server (with SSR)

```bash
yarn workspace @uos-judo/web dev:server
```

4. production build

```bash
yarn workspace @uos-judo/web build
```

5. production run

```bash
yarn workspace @uos-judo/web start
```

## Server Architecture

The server has been refactored to TypeScript for better maintainability. The server code is organized in the `server/` directory with the following structure:

- `server/index.ts` - Main entry point
- `server/config.ts` - Configuration and environment variables
- `server/middleware/` - Express middleware (logger, security, error handler)
- `server/routes/` - Route handlers (BFF, upload, SSE)
- `server/services/` - Business logic (S3 upload, proxy)
- `server/utils/` - Utility functions (SSE tokens, progress tracking)
- `server/types.ts` - TypeScript type definitions

See `server/README.md` for detailed server documentation.

# 기술스택

## FE

- React 18
- TypeScript
- Recoil
- TailwindCSS v4
- Vite
- TanStack Query (React Query)

## Server (BFF - Backend For Frontend)

- Node.js + Express
- TypeScript
- AWS S3 (File Upload)
- Server-Side Rendering (SSR) with Vite

## BE

- Java
- Java Spring
- MySQL

## DevOps

- aws
  - ec2
  - s3
- docker
- nginx
- github action

## OAS

- Swagger

# 프로젝트 멤버

## FE

34기 김영민

## BE

38기 이진수

# contact

[uosjudojiho@gmail.com](mailto:uosjudojiho@gmail.com)
