# TravelBudget

A mobile-first travel planning platform where users swipe through curated trip suggestions, save favourites, and manage their travel wishlist.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/travel-budget run dev` — run the frontend (port 3001)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query
- Auth: Clerk (email + Google OAuth + guest mode)
- API: Express 5 + OpenAPI contract-first codegen (Orval)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle ORM schemas (`savedTrips.ts`, `userPreferences.ts`)
- `artifacts/travel-budget/src/` — React frontend
  - `pages/` — landing, sign-in, sign-up, onboarding, discover, saved, saved-detail, profile, privacy, not-found
  - `components/` — layout, nav, cookie-banner, shadcn/ui primitives
  - `lib/` — queryClient, utils
- `artifacts/api-server/src/` — Express API server
  - `routes/` — trips, savedTrips, preferences

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks + Zod schemas used by both client and server
- Clerk auth via `@clerk/express` middleware on the API; `@clerk/react` on the frontend; proxy path `/api/__clerk` for FAPI
- Port 3001 for frontend (Replit workflow runner only supports specific ports — 18095 was not in the list)
- Tinder-style swipe on Discover page uses Framer Motion drag constraints with opacity/rotate transforms
- Guest mode: users can browse Discover without signing in; saving trips requires auth

## Product

- **Landing** — hero with Get Started, Log In, and Continue as Guest
- **Auth** — Clerk-powered sign-in/sign-up (email + Google)
- **Onboarding** — multi-step preference wizard (budget, climate, trip style)
- **Discover** — Tinder swipe deck; swipe right to save, left to skip; pulls AI-generated mock trips from API
- **Saved** — grid of saved trips with delete support
- **Saved Detail** — full trip itinerary view
- **Profile** — user info, preferences summary, stats
- **Privacy Policy** — standalone page
- **Cookie Banner** — shown on first visit, stores consent in localStorage

## Gotchas

- Port must be in Replit's supported list (3000, 3001, 3002, 3003, 4200, 5000, 5173, 6000, 6800, 8000, 8008, 8080, 8099, 9000). 18095 does NOT work.
- Do not run `pnpm dev` at workspace root — use workflow runner or `pnpm --filter` with PORT + BASE_PATH env vars.
- `tailwindcss({ optimize: false })` required in vite.config.ts for Clerk themes compatibility.
- After schema changes run `pnpm --filter @workspace/db run push` before restarting the API server.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
