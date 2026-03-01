# Gemini CLI Guidelines - Admin Project

This document serves as a foundational mandate for Gemini CLI (AI Agent) when working on the `admin` project. Adhere to these architectural patterns, coding standards, and tech stack preferences.

## 1. Architecture: Feature-Sliced Design (FSD)

The project follows the **Feature-Sliced Design (FSD)** architecture (referred to as FDS in internal discussions). Organize code into layers:

- **app**: Global configuration, providers, and styles (e.g., `src/app/StandaloneApp.tsx`, `src/app/routers`).
- **pages**: Full pages of the application. Business logic should be minimal here, delegating to features or widgets.
- **widgets**: (Optional) Complex components composed of several features (e.g., a header or complex sidebar).
- **features**: User-centric functionality (e.g., `src/features/members`). Must be independent and focused.
- **entities**: (Optional) Business entities (e.g., `User`, `Article`).
- **shared**: Reusable UI components, hooks, and utility libraries (e.g., `src/shared/lib`, `src/shared/hooks`).

## 2. Tech Stack & Preferences

- **Framework**: React 18+ (TypeScript).
- **Language**: Strict TypeScript. Use interfaces for props and descriptive types for complex data.
- **Utility Library**: **es-toolkit** is the primary choice for utility functions (cloning, grouping, etc.). Use it instead of Lodash.
- **Styling**: TailwindCSS (v4) with `clsx` and `tailwind-merge` for class management. Always use the `cn` utility from `src/shared/lib/utils.ts`.
- **API**: Use `@packages/api` (v2Admin hooks) for all server interactions.
- **Icons**: Use components from `lucide-react` or the internal SVG components in `src/components/icons`.

## 3. Coding Standards & Patterns

- **Barrel Exports**: Use the barrel export pattern (`index.ts`) for components and features to simplify imports and maintain clean public APIs.
- **Component Structure**:
  - Prefer functional components with Arrow Functions.
  - Keep components small and focused.
  - Use `Suspense` for async data loading where applicable.
- **State Management**: Use **Zustand** for global client-side state.
- **Error Handling**: Use `sonner` for user-facing notifications (Success/Error). Avoid native `alert()`.
- **Naming Conventions**:
  - Components: PascalCase (e.g., `MemberTable.tsx`).
  - Hooks: camelCase starting with `use` (e.g., `useMemberSort.ts`).
  - Files/Folders: kebab-case (e.g., `member-table`, `use-member-sort`).

## 4. Development Workflow

- **Research First**: Analyze existing FSD layers before adding new code.
- **Surgical Edits**: Make precise changes using `replace` rather than rewriting whole files.
- **Validation**: Always verify changes by checking for TypeScript errors and ensuring the build is successful.
- **Testing**: Add or update tests when introducing new logic or fixing bugs.

_Strictly follow the existing conventions found in the codebase._
