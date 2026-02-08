# Server Directory Structure

This directory contains the TypeScript-based server code for the Jiho frontend application.

## Directory Structure

```
server/
├── index.ts                 # Main entry point for the server
├── config.ts                # Configuration and environment variables
├── types.ts                 # TypeScript type definitions
├── middleware/              # Express middleware functions
│   ├── logger.ts           # Request logging middleware
│   ├── security.ts         # Security and authentication middleware
│   └── error-handler.ts    # Error handling middleware
├── routes/                  # Route handlers
│   └── bff.ts              # BFF (Backend For Frontend) routes
├── services/                # Business logic services
│   └── proxy.ts            # Backend proxy service
└── utils/                   # Utility functions
    └── (no upload-related utilities)
```

## Features

- **Type Safety**: Full TypeScript support for better maintainability
- **Modular Architecture**: Clear separation of concerns with organized directory structure
- **SSR Support**: Server-Side Rendering with Vite integration
- **BFF Pattern**: Backend For Frontend proxy routes
- **Security**: Request validation and authentication middleware
- **Development Mode**: Hot-reload support with tsx

## Running the Server

### Development Mode

```bash
npm run dev:server
```

### Production Mode (Local)

```bash
npm run preview  # Uses tsx for convenience
```

### Production Mode (Docker)

```bash
# Build TypeScript first
npm run build:server-ts

# Run compiled JavaScript
NODE_ENV=production node build/server-ts/index.js
```

## Building

The TypeScript server code is compiled during the build process:

```bash
npm run build:server-ts
```

This outputs compiled JavaScript to `build/server-ts/`.

### Docker Build

In Docker, the server runs as compiled JavaScript for better performance:

- TypeScript is compiled during the Docker build stage
- Production container runs `node build/server-ts/index.js`
- No tsx dependency needed in production

## Configuration

Server configuration is managed through environment variables:

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 3000)
- `INTERNAL_API_TOKEN` - Internal API authentication token
- `BACKEND_URL` - Backend API URL
- `ALLOWED_HOSTS` - Allowed hosts for CORS

See `.env.example` for a complete list of environment variables.
