# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the frontend for the University of Seoul (UOS) Judo club website "Jiho" (지호), built with React 18, TypeScript, and Vite. The application serves as a comprehensive platform for the judo club with features including news articles, training logs, photo galleries, notices, and administrative functions.

## Development Commands

### Core Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (outputs to `build/` directory)
- `npm run start` - Preview production build
- `npm run start:prod` - Build and serve production version
- `npm run type-check` - Run TypeScript type checking

### SSR & Deployment
- `npm run start:ssr` - Start SSR server (Node.js)
- `npm run prebuild` - Generate sitemap (runs automatically before build)

## Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Recoil for global state
- **Styling**: Styled-components + TailwindCSS v4
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **UI Components**: Custom components + Radix UI primitives

### Project Structure
```
src/
├── api/                 # API clients and queries
│   ├── config/         # API configuration
│   ├── admin/          # Admin-specific API calls
│   ├── news/           # News-related API (client.ts, query.ts)
│   └── tradings/       # Training logs API
├── components/         # React components
│   ├── Home/           # Homepage components
│   ├── News/           # News article components
│   ├── Notice/         # Notice components
│   ├── Photo/          # Photo gallery components
│   ├── admin/          # Admin interface components
│   ├── common/         # Shared components (modals, buttons, etc.)
│   ├── layouts/        # Layout components (Row, Col, Carousel, etc.)
│   └── ui/             # Base UI components (button, input, etc.)
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── [feature]/      # Feature-specific pages
├── routers/            # Route configuration
├── lib/                # Utilities and configuration
│   ├── assets/         # Static assets (images, fonts, SVGs, JSON)
│   ├── theme/          # Styled-components theme
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
└── hooks/              # Custom React hooks
```

### Key Architectural Patterns

#### API Layer
- Uses TanStack Query for server state management
- API clients organized by feature (news, tradings, admin)
- Separate query files for React Query hooks
- Proxy configuration in Vite routes `/api` requests to `https://uosjudo.com/api`

#### State Management
- **Recoil** for global client state
- **TanStack Query** for server state and caching
- Component-level state with React hooks

#### Styling Architecture
- **Styled-components** for component-level styling with theme support
- **TailwindCSS v4** for utility classes
- Theme system with light/dark mode support (dark mode TODO)
- Global styles defined in `GlobalStyle.ts`

#### Responsive Design
- Mobile-first approach with separate mobile/PC components where needed
- Custom hooks for touch interactions (`useTouchScroll`)
- Responsive layout components (`MobileRowColLayout`)

### Admin System
- Separate admin routing (`AdminRouter.tsx`)
- Form components for content management (articles, news, training logs)
- Image upload functionality
- Authentication required for admin access

### SEO & Performance
- Sitemap generation script (`script/sitemap.js`)
- Meta tags handled via custom `MyHelmet.tsx` component
- Code splitting at route level
- Image optimization and lazy loading

## Development Notes

### API Integration
- Backend API documented at `https://uosjudo.com/api/docs`
- All API calls go through the proxy configured in `vite.config.ts`
- Use existing API client patterns when adding new endpoints

### Component Development
- Follow existing patterns in `components/` directories
- Use TypeScript interfaces for all props
- Leverage existing layout components (`Row`, `Col`, `Carousel`) for consistency
- Custom hooks available for common functionality (click outside, key handling)

### Styling Guidelines
- Use styled-components for component-specific styles
- TailwindCSS for spacing, colors, and responsive utilities
- Follow existing theme structure for colors and typography
- Maintain responsive design patterns

### Code Conventions
- TypeScript strict mode enabled
- Component files use `.tsx` extension
- Type definitions in dedicated files under `lib/types/`
- Custom hooks prefixed with `use`
- API-related files organized by feature with consistent naming (`client.ts`, `query.ts`)