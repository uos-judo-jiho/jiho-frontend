# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the frontend for the University of Seoul (UOS) Judo club website "Jiho" (지호), built with React 18, TypeScript, and Vite. The application serves as a comprehensive platform for the judo club with features including news articles ("지호지"), training logs, photo galleries, notices, and administrative functions.

**Key Technologies:** React 18, TypeScript, Vite, Server-Side Rendering (SSR), Node.js/Express BFF server, Recoil, TanStack Query, Styled-components, TailwindCSS v4, Radix UI.

**Backend Integration:** Java Spring backend API at `https://uosjudo.com/api` (documented at `/api/docs`).

## Development Commands

### Core Development

- `npm run dev` - Start Vite dev server on port 3000 (client-side only, with HMR)
- `npm run dev:server` - Start SSR development server with hot-reload (recommended for full-stack development)
- `npm run type-check` - Run TypeScript type checking across all configs

### Building

- `npm run build` - Full production build (runs sitemap generation, client build, server build, server TypeScript compilation)
- `npm run build:client` - Build client bundle only to `build/client/`
- `npm run build:server` - Build SSR entry only to `build/server/`
- `npm run build:server-ts` - Compile TypeScript server code to `build/server-ts/`
- `npm run clean` - Remove build directory

### Production & Preview

- `npm run preview` - Preview production build locally (uses tsx)
- `npm run start:prod` - Run compiled production server (for Docker)
- `npm run start` - Alias for preview

### Utilities

- `npm run prebuild` - Generate sitemap (runs automatically before build)

## Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite 6
- **State Management**: Recoil (client state), TanStack Query v5 (server state)
- **Styling**: Styled-components 5.3.9 + TailwindCSS v4
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives + custom components
- **Server**: Node.js + Express with TypeScript (BFF pattern)
- **SSR**: Vite SSR with React hydration
- **Icons**: Lucide React

### Project Structure

```
jiho-frontend/
├── src/
│   ├── api/                  # API layer (client.ts + query.ts pattern)
│   │   ├── config/           # Axios instance configuration
│   │   ├── _internal/        # Internal BFF API calls
│   │   ├── news/             # News API (client.ts, query.ts)
│   │   ├── trainings/        # Training logs API
│   │   ├── notices/          # Notices API
│   │   └── admin/            # Admin-specific APIs
│   ├── components/           # React components
│   │   ├── ui/               # Radix UI-based components (button, dialog, input, etc.)
│   │   ├── common/           # Shared components (Navbar, Footer, Modals, etc.)
│   │   ├── layouts/          # Layout components (Row, Col, Carousel, Slider)
│   │   ├── Home/             # Homepage components
│   │   ├── News/             # News/article components
│   │   ├── Photo/            # Photo gallery components
│   │   ├── Notice/           # Notice components
│   │   ├── admin/            # Admin interface components
│   │   └── icons/            # Icon components
│   ├── pages/                # Page-level components
│   │   ├── News/             # News pages
│   │   ├── Photo/            # Photo gallery pages
│   │   ├── Notice/           # Notice pages
│   │   └── admin/            # Admin pages
│   ├── routers/              # Routing configuration
│   │   ├── AppRouter.tsx     # Main app routes
│   │   └── AdminRouter.tsx   # Admin routes (lazy-loaded)
│   ├── lib/                  # Utilities and configuration
│   │   ├── theme/            # Styled-components theme system
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── constant/         # Constants (colors, fonts, URLs)
│   │   └── assets/           # Static assets (images, fonts, data)
│   ├── hooks/                # Custom React hooks
│   │   ├── upload/           # File upload hooks with SSE
│   │   └── useToggle/        # Toggle state management
│   ├── recoils/              # Recoil state atoms
│   │   ├── news.ts           # News state
│   │   └── session.ts        # Session state
│   ├── context/              # React contexts
│   ├── helmet/               # SEO meta tags management
│   ├── seo/                  # Structured data for SEO (JSON-LD)
│   ├── App.tsx               # Root App component
│   ├── main.tsx              # Client entry point
│   ├── entry-server.tsx      # SSR entry point with route-based prefetching
│   └── index.css             # Global CSS (Tailwind + CSS variables)
├── server/                   # TypeScript BFF server
│   ├── index.ts              # Server entry point
│   ├── config.ts             # Server configuration
│   ├── middleware/           # Express middleware
│   ├── routes/               # Route handlers (BFF, upload, SSE)
│   ├── services/             # Business logic (S3, proxy)
│   └── utils/                # Server utilities
├── public/                   # Static files served directly
├── script/                   # Build and utility scripts
│   ├── build.sh              # Production build script
│   ├── sitemap.js            # Sitemap generation
│   └── docker-*.sh           # Docker utilities
└── build/                    # Build output
    ├── client/               # Client-side bundle
    ├── server/               # SSR bundle
    └── server-ts/            # Compiled server code
```

### Key Architectural Patterns

#### 1. API Layer Pattern

**Consistent structure across all features:**

```
api/[feature]/
├── client.ts    # Raw API calls using axios
├── query.ts     # TanStack Query hooks
└── index.ts     # Exports
```

**Example:**
```typescript
// client.ts - Raw API function
export const getNews = async (year: string): Promise<NewsType | null>

// query.ts - React Query hook
export const useNewsQuery = (year: string) => useQuery({...})
```

**API Configuration:**
- Central axios instance in `src/api/config/index.ts`
- Smart base URL detection (SSR vs client, dev vs prod)
- Automatic 401 redirect to admin login
- Vite proxy: `/api` → `https://uosjudo.com/api`
- Internal API with special authentication token (`VITE_INTERNAL_API_TOKEN`) for BFF routes

#### 2. Server-Side Rendering (SSR)

**Complete SSR flow:**
1. Express server receives request (`server/index.ts`)
2. Server determines route and prefetches data via TanStack Query (`entry-server.tsx`)
3. React app renders to string on server
4. Styled-components collects styles during SSR
5. Query cache is dehydrated and injected into HTML
6. Client hydrates with same data (prevents flash of content)

**Key SSR Files:**
- `src/entry-server.tsx` - SSR render function with route-based prefetching (e.g., `/news/:year`, `/photo`)
- `server/index.ts` - Express server with SSR middleware
- Route-specific data prefetching prevents SSR mismatches

**SEO Features:**
- Dynamic meta tags via custom Helmet context (`src/helmet/`)
- Structured data (JSON-LD) injection (`src/seo/`)
- Sitemap generation script (`script/sitemap.js`)

#### 3. BFF (Backend for Frontend) Pattern

**Internal Routes (`/_internal/*`):**
- S3 file upload handling with multer
- Upload progress tracking via Server-Sent Events (SSE)
- Security middleware with token validation (`INTERNAL_API_TOKEN`)
- Proxy to backend API with request transformation

**Benefits:**
- Encapsulates S3 credentials on server (security)
- Real-time progress tracking for large uploads
- Authentication layer before backend
- CORS handling

**Files:**
- `server/routes/upload.ts` - Upload endpoint
- `server/services/s3-upload.ts` - S3 integration
- `server/routes/sse-progress.ts` - SSE progress streaming
- `src/hooks/upload/` - Client-side upload hooks

#### 4. File Upload System Architecture

**Upload Flow:**
1. Client requests SSE token
2. Client initiates upload with token
3. Server receives file via multer
4. Server uploads to S3 with progress tracking
5. Progress broadcast via SSE endpoint
6. Client receives real-time progress updates

#### 5. State Management Strategy

**Three-tier approach:**

1. **Server State (TanStack Query)**
   - All API data fetching and caching
   - 24-hour stale time for most queries
   - Automatic background refetching
   - SSR-compatible with hydration

2. **Global Client State (Recoil)**
   - News selection state (`recoils/news.ts`)
   - Session/authentication state (`recoils/session.ts`)
   - UI state persisting across routes

3. **Component State (React hooks)**
   - Local UI state (modals, forms)
   - Custom hooks for common patterns

#### 6. Styling Architecture

**Hybrid Approach:**

**CSS Variables System (`index.css`):**
- Shadcn/UI design tokens (--background, --foreground, etc.)
- Custom UOS Judo theme variables (--theme-primary, --theme-bg, etc.)
- Dark mode support via `.dark` class
- Typography scales and line heights

**TailwindCSS v4:**
- Utility classes for spacing, layout, responsiveness
- Custom breakpoints: `xs: 340px, sm: 540px, md: 860px, lg: 1200px`
- Extended with custom theme colors and font sizes
- `@tailwindcss/vite` plugin integration

**Styled-components:**
- Component-scoped styles with theme prop access
- `MediaLayout` CSS helper for responsive breakpoints
- SSR-compatible with style tag collection
- Theme provider with light/dark theme objects

**Typical Component Pattern:**
```typescript
// Combines TailwindCSS utilities with styled-components
<StyledComponent className="flex gap-4 p-8">
  {children}
</StyledComponent>
```

#### 7. Routing Architecture

**Main Routes (`routers/AppRouter.tsx`):**
- Public pages (Home, News, Photo, Notice, About)
- Admin routes lazy-loaded via `WithSuspense` wrapper
- 404 fallback

**Admin Routes (`routers/AdminRouter.tsx`):**
- Completely separate router for admin functionality
- Lazy-loaded components for code splitting
- Nested routes for different content types (news, training, notice)
- Write/edit pages with markdown editor support

#### 8. Component Organization

**UI Components (`components/ui/`):**
- Radix UI-based primitives (button, dialog, input, textarea, calendar, card)
- Consistent with Shadcn/UI patterns
- Fully typed with TypeScript
- Using `class-variance-authority` for variants

**Layout Components (`components/layouts/`):**
- `Row`, `Col` - Grid system components
- `Carousel`, `Slider` - Image/content carousels
- `ScrollSnap` - Touch-friendly scrolling
- `ListContainer` - Reusable list wrapper
- `Title` - Styled heading component

**Common Components (`components/common/`):**
- `Navbar`, `Footer` - Site-wide navigation
- `MobileHeader` - Mobile-specific header
- `Modals` - Various modal dialogs
- `Markdown` - Markdown rendering with preview
- `Buttons` - Custom button components
- `Skeletons` - Loading states

### Admin System

- Separate admin routing (`AdminRouter.tsx`)
- Lazy-loaded components for code splitting
- Markdown editor with preview for content creation
- Image upload functionality with S3 integration
- Authentication required (cookies managed by backend)
- Form components for managing articles, news, training logs, notices

### SEO & Performance

- **SSR** - Server-Side Rendering for initial page load
- **Sitemap** - Auto-generated via `script/sitemap.js`
- **Meta tags** - Dynamic meta tags via custom Helmet context
- **Structured data** - JSON-LD for news articles and organization info
- **Code splitting** - Route-level and component-level (admin routes)
- **Image optimization** - Lazy loading and responsive images

## Configuration

### TypeScript Configuration

**Multi-config setup:**
- `tsconfig.json` - Base config with path aliases (`@/*` → `./src/*`)
- `tsconfig.app.json` - Frontend app config (strict mode, React JSX)
- `tsconfig.node.json` - Node.js config for Vite
- `tsconfig.server.json` - Server-side code compilation

**Key Settings:**
- Strict mode enabled
- ES2020 target with ESNext modules
- Bundler module resolution

### Vite Configuration

**Plugins:**
- `@vitejs/plugin-react` - React Fast Refresh
- `@tailwindcss/vite` - TailwindCSS v4 integration

**Dev Server:**
- Port 3000
- API proxy: `/api` → `https://uosjudo.com/api`
- WebSocket support for HMR

**Build:**
- ESBuild minification
- Console/debugger removal in production
- SSR externalization for styled-components

### Environment Variables

**Build-time (required for build):**
- `VITE_INTERNAL_API_TOKEN` - Internal API token for BFF authentication

**Runtime (server):**
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 3000)
- `INTERNAL_API_TOKEN` - Server-side API token (must match VITE_INTERNAL_API_TOKEN)
- `BACKEND_URL` - Backend API base URL
- AWS S3 credentials (for file uploads)

## Development Workflows

### API Integration

- Backend API documented at `https://uosjudo.com/api/docs`
- All API calls go through the proxy configured in `vite.config.ts` (dev) or direct to backend (production)
- Use existing API client patterns when adding new endpoints (always create `client.ts` + `query.ts` pair)

### Adding New API Endpoints

1. Create `src/api/[feature]/client.ts` with raw API functions
2. Create `src/api/[feature]/query.ts` with TanStack Query hooks
3. Export from `src/api/[feature]/index.ts`
4. Add type definitions to `src/lib/types/`

### Component Development

- Follow existing patterns in `components/` directories
- Use TypeScript interfaces for all props
- Leverage existing layout components (`Row`, `Col`, `Carousel`) for consistency
- Custom hooks available for common functionality (click outside, key handling)
- Prefer composition over inheritance

### Styling Guidelines

- Use styled-components for component-specific styles with theme access
- TailwindCSS for spacing, colors, and responsive utilities
- Follow existing theme structure for colors and typography (`src/lib/theme/`)
- Maintain responsive design patterns using `MediaLayout` helper
- Respect existing CSS variables in `index.css`

### Code Conventions

- TypeScript strict mode enabled
- Component files use `.tsx` extension
- Type definitions in dedicated files under `lib/types/`
- Custom hooks prefixed with `use`
- API-related files organized by feature with consistent naming (`client.ts`, `query.ts`)
- Consistent file naming: PascalCase for components, kebab-case for utilities

## Deployment

### Docker Build

**Multi-stage Dockerfile:**
1. **deps** - Install all dependencies
2. **builder** - Build client and server bundles
3. **runner** - Production runtime with minimal dependencies

**Production:**
- Compiled TypeScript server (no tsx in production)
- Non-root user for security
- dumb-init for proper signal handling
- Compressed assets with sirv

### Build Process

1. `script/sitemap.js` generates sitemap
2. `npm run clean` removes old build
3. Vite builds client bundle
4. Vite builds SSR entry
5. TypeScript compiles server code
6. Docker packages everything

## Important Notes

- **Responsive Design**: Mobile-first approach with custom breakpoints
- **Error Boundaries**: Use `WithSuspense` wrapper for lazy-loaded components
- **Type Safety**: Comprehensive TypeScript coverage throughout
- **Security**: S3 credentials on server only, token-based internal API authentication
- **Performance**: Code splitting, image optimization, TanStack Query caching with 24-hour stale time
