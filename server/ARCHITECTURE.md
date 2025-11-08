# Server Architecture

## Overview

The server is built using a modular architecture pattern with TypeScript for type safety and maintainability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Express Application                       │
│                         (server/index.ts)                        │
└─────────────────────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
        ┌───────▼────────┐                 ┌────────▼───────┐
        │   Middleware   │                 │     Routes     │
        └───────┬────────┘                 └────────┬───────┘
                │                                   │
    ┌───────────┼───────────┐          ┌───────────┼───────────┐
    │           │           │          │           │           │
┌───▼───┐  ┌───▼────┐  ┌──▼───┐  ┌───▼───┐  ┌───▼────┐  ┌──▼────┐
│Logger │  │Security│  │Error │  │  BFF  │  │ Upload │  │  SSE  │
│       │  │        │  │Handler│  │       │  │        │  │Progress│
└───────┘  └────────┘  └──────┘  └───┬───┘  └───┬────┘  └───────┘
                                      │          │
                         ┌────────────┴──────┬───┴───────┐
                         │                   │           │
                    ┌────▼─────┐      ┌─────▼───┐  ┌───▼──────┐
                    │  Proxy   │      │S3 Upload│  │  Multer  │
                    │  Service │      │ Service │  │  Config  │
                    └──────────┘      └─────────┘  └──────────┘
                                            │
                                      ┌─────┴─────┐
                                      │           │
                                ┌─────▼────┐ ┌───▼──────┐
                                │SSE Tokens│ │ Progress │
                                │  Utils   │ │ Tracking │
                                └──────────┘ └──────────┘
```

## Request Flow

### 1. SSR Request Flow

```
Client Request (e.g., GET /)
    ↓
Express App (index.ts)
    ↓
Check if BFF internal route
    ↓ (No)
Vite Middleware (Dev) or Static Assets (Prod)
    ↓
SSR Handler
    ↓
Load React App
    ↓
Render HTML
    ↓
Send Response to Client
```

### 2. BFF API Request Flow

```
Client Request (e.g., GET /_internal/api/news)
    ↓
Express App (index.ts)
    ↓
Security Middleware (middleware/security.ts)
    ├─ Validate token
    ├─ Check origin
    └─ Verify user agent
    ↓
Logger Middleware (middleware/logger.ts)
    ↓
BFF Router (routes/bff.ts)
    ↓
Proxy Service (services/proxy.ts)
    ↓
Backend API (uosjudo.com/api)
    ↓
Transform Response
    ↓
Send Response to Client
```

### 3. File Upload Flow

```
Client Request (POST /_internal/api/upload)
    ↓
Express App (index.ts)
    ↓
Security Middleware
    ↓
Multer Middleware (services/multer.ts)
    ├─ Validate file type
    ├─ Check file size
    └─ Store in memory
    ↓
Upload Router (routes/upload.ts)
    ├─ Generate upload ID
    ├─ Generate SSE token (utils/sse-tokens.ts)
    ├─ Return upload ID to client
    └─ Start background upload
        ↓
    S3 Upload Service (services/s3-upload.ts)
        ├─ Update progress (utils/upload-progress.ts)
        └─ Upload to AWS S3
    ↓
Client connects to SSE endpoint
    ↓
SSE Progress Handler (routes/sse-progress.ts)
    ├─ Validate SSE token
    ├─ Stream progress updates
    └─ Close connection on completion
```

## Module Responsibilities

### Core (`index.ts`)

- Application initialization
- Middleware registration
- Route mounting
- Development/Production mode switching
- Server startup

### Configuration (`config.ts`)

- Environment variable loading
- S3 client configuration
- Constants definition
- Custom console configuration

### Types (`types.ts`)

- TypeScript interfaces
- Type definitions for:
  - Upload progress
  - SSE tokens
  - S3 responses
  - Console prefixes

### Middleware Layer

#### Logger (`middleware/logger.ts`)

- Request/response logging
- Performance timing
- Timestamp tracking

#### Security (`middleware/security.ts`)

- Token validation
- Origin verification
- User-Agent checking
- Content-Type validation

#### Error Handler (`middleware/error-handler.ts`)

- Centralized error handling
- Error logging
- Status code management
- Development stack traces

### Routes Layer

#### BFF Routes (`routes/bff.ts`)

- Health check endpoint
- API information endpoint
- News proxy routes
- Notices proxy routes
- Trainings proxy routes
- Admin proxy routes

#### Upload Routes (`routes/upload.ts`)

- Single file upload
- Multiple file upload
- Presigned URL generation
- Upload configuration
- Upload cancellation

#### SSE Progress (`routes/sse-progress.ts`)

- Server-Sent Events handler
- Progress streaming
- Token validation
- Connection management

### Services Layer

#### S3 Upload (`services/s3-upload.ts`)

- AWS S3 integration
- File upload logic
- Progress tracking
- Error handling
- Presigned URL generation

#### Proxy (`services/proxy.ts`)

- Backend API proxy
- Request transformation
- Header management
- Error handling

#### Multer (`services/multer.ts`)

- File upload configuration
- File type validation
- Size limit enforcement
- Memory storage setup

### Utils Layer

#### SSE Tokens (`utils/sse-tokens.ts`)

- Token generation
- Token validation
- Token expiration
- Security checks

#### Upload Progress (`utils/upload-progress.ts`)

- Progress state management
- In-memory tracking

## Data Flow

### Configuration Loading

```
.env file
    ↓
dotenv.config()
    ↓
config.ts exports
    ↓
Used by all modules
```

### State Management

```
In-Memory Maps
├─ sseTokenMap (utils/sse-tokens.ts)
│  └─ uploadId → { token, createdAt, expiresAt, ipAddress, used }
│
└─ uploadProgressMap (utils/upload-progress.ts)
   └─ uploadId → { fileName, progress, status, url, error }
```

## Security Layers

1. **Token Authentication**: Custom header `x-jiho-internal` required
2. **Origin Validation**: Check request origin/referer
3. **User-Agent Filtering**: Block suspicious agents (curl, wget)
4. **Content-Type Validation**: Enforce proper content types
5. **SSE Token System**: One-time tokens for upload progress
6. **IP Verification**: Match IP address for SSE tokens

## Error Handling Strategy

```
Try-Catch Blocks (Route Handlers)
    ↓
next(error)
    ↓
Error Handler Middleware
    ├─ Log error details
    ├─ Determine status code
    ├─ Format error response
    └─ Send to client
```

## Performance Considerations

1. **Static Asset Caching**: Production HTML template cached in memory
2. **Compression**: Gzip compression for production responses
3. **Connection Pooling**: S3 client reused across requests
4. **Async Operations**: Background file uploads don't block responses
5. **Memory Storage**: Files stored in memory (RAM) for faster upload

## Scalability

### Horizontal Scaling

- Stateless design (except in-memory maps)
- For production, consider Redis for:
  - SSE token storage
  - Upload progress tracking

### Vertical Scaling

- Memory-based file uploads (configurable limit)
- S3 direct upload option via presigned URLs
- Streaming support for large files

## Monitoring and Debugging

### Logging Points

1. Request/Response logging (all requests)
2. Security rejections (failed auth)
3. BFF proxy errors (backend failures)
4. S3 upload errors (AWS issues)
5. SSE connections (client tracking)

### Debug Mode

Set `NODE_ENV=development` for:

- Detailed error stack traces
- Verbose logging
- Hot reload with tsx

## Development vs Production

| Aspect        | Development     | Production (Local) | Production (Docker) |
| ------------- | --------------- | ------------------ | ------------------- |
| Server        | Vite Dev Server | Static Assets      | Static Assets       |
| TypeScript    | tsx (runtime)   | tsx (runtime)      | Compiled JS         |
| Execution     | tsx watch       | tsx                | node                |
| Logging       | Verbose         | Minimal            | Minimal             |
| Error Details | Full stack      | Message only       | Message only        |
| Hot Reload    | Yes             | No                 | No                  |
| Compression   | No              | Yes                | Yes                 |

## Dependencies

### Runtime Dependencies

- `express` - Web framework
- `@aws-sdk/client-s3` - S3 client
- `multer` - File upload middleware
- `dotenv` - Environment variables
- `uuid` - Unique ID generation
- `compression` - Gzip compression (production)
- `sirv` - Static file server (production)

### Development Dependencies

- `@types/express` - Express types
- `@types/multer` - Multer types
- `@types/compression` - Compression types
- `typescript` - TypeScript compiler
- `tsx` - TypeScript executor (development/local only)

## Future Enhancements

1. **Testing**: Add unit and integration tests
2. **Caching**: Implement Redis for distributed state
3. **Rate Limiting**: Add rate limiting middleware
4. **API Documentation**: Add OpenAPI/Swagger docs
5. **Metrics**: Add Prometheus metrics
6. **Tracing**: Add distributed tracing (e.g., OpenTelemetry)
7. **Health Checks**: Enhanced health endpoints with dependencies
8. **Graceful Shutdown**: Implement proper shutdown handlers
