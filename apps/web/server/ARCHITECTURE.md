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
│Logger │  │Security│  │Error │  │  BFF  │  │ Proxy │  │  SSR  │
│       │  │        │  │Handler│  │       │  │Service│  │Handler│
└───────┘  └────────┘  └──────┘  └───┬───┘  └───┬────┘  └───────┘
                                      │          │
                         ┌────────────┴──────────┘
                         │
                    ┌────▼─────┐
                    │  Proxy   │
                    │  Service │
                    └──────────┘
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

## Module Responsibilities

### Core (`index.ts`)

- Application initialization
- Middleware registration
- Route mounting
- Development/Production mode switching
- Server startup

### Configuration (`config.ts`)

- Environment variable loading
- Constants definition
- Custom console configuration

### Types (`types.ts`)

- TypeScript interfaces
- Type definitions for:
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

### Services Layer

#### Proxy (`services/proxy.ts`)

- Backend API proxy
- Request transformation
- Header management
- Error handling

### Utils Layer

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

## Security Layers

1. **Token Authentication**: Custom header `x-jiho-internal` required
2. **Origin Validation**: Check request origin/referer
3. **User-Agent Filtering**: Block suspicious agents (curl, wget)
4. **Content-Type Validation**: Enforce proper content types

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
3. **Async Operations**: Non-blocking SSR and proxy responses

## Scalability

### Horizontal Scaling

- Stateless design

### Vertical Scaling

- Streaming support for large files

## Monitoring and Debugging

### Logging Points

1. Request/Response logging (all requests)
2. Security rejections (failed auth)
3. BFF proxy errors (backend failures)
4. SSR render errors

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
- `dotenv` - Environment variables
- `compression` - Gzip compression (production)
- `sirv` - Static file server (production)

### Development Dependencies

- `@types/express` - Express types
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
