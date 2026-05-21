# Wanderlust Swipe — TravelBudget

A mobile-first travel planning app where users swipe through curated AI-generated trip suggestions, save favourites, and manage their travel wishlist. Built with React, Express, PostgreSQL, and Clerk auth.

## Live demo

Deployed on Replit — see the preview in the repo.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query |
| Auth | Clerk (email + Google OAuth + guest mode) |
| API | Express 5, OpenAPI contract-first (Orval codegen) |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod |
| Monorepo | pnpm workspaces |

---

## Project layout

```
artifacts/
  travel-budget/   # React + Vite frontend  (port 3001)
  api-server/      # Express API server      (port 8080)
lib/
  api-spec/        # OpenAPI spec + Orval codegen
  api-client-react/ # Generated React Query hooks
  api-zod/         # Generated Zod schemas
  db/              # Drizzle ORM schema + migrations
```

---

## Quick start (local)

### Prerequisites

- **Node.js 20+**
- **pnpm 9+** — `npm install -g pnpm`
- **PostgreSQL** running locally (or use a free cloud DB — see below)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
# Frontend
cp artifacts/travel-budget/.env.example artifacts/travel-budget/.env

# API server
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit both `.env` files and fill in:

- **`DATABASE_URL`** — your PostgreSQL connection string
- **`VITE_CLERK_PUBLISHABLE_KEY`** — from [Clerk dashboard](https://clerk.com) > API Keys
- **`CLERK_SECRET_KEY`** — from [Clerk dashboard](https://clerk.com) > API Keys
- **`SESSION_SECRET`** — any random 32+ character string

> **Free PostgreSQL options:** [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app)
>
> **Free Clerk:** Sign up at [clerk.com](https://clerk.com) — the free tier is enough for development.

### 3. Push the database schema

```bash
pnpm --filter @workspace/db run push
```

### 4. Run both servers

Open **two terminals**:

```bash
# Terminal 1 — API server (port 8080)
PORT=8080 pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend (port 3001)
pnpm --filter @workspace/travel-budget run dev
```

Then open **http://localhost:3001** in your browser.

---

## Deployment

### Vercel (recommended for frontend)

1. Import the repo into Vercel
2. Set **Root Directory** to `artifacts/travel-budget`
3. Set **Framework Preset** to `Vite`
4. Add environment variables in Vercel dashboard (same as `.env.example`)
5. Deploy the API server separately (Railway, Render, Fly.io, etc.) and set `VITE_API_BASE_URL` to its URL

### StackBlitz / CodeSandbox

These platforms support pnpm workspaces. Open the repo URL directly:

- StackBlitz: `https://stackblitz.com/github/samuelzezza10/Wanderlust-Swipe`
- CodeSandbox: `https://codesandbox.io/p/github/samuelzezza10/Wanderlust-Swipe`

You still need to set the `.env` files as described above.

### GitHub Pages (frontend only)

Set `BASE_PATH=/Wanderlust-Swipe/` in the Vite build environment. The API must be hosted separately and `VITE_API_BASE_URL` pointed to it.

---

## Development commands

```bash
# Install all workspace deps
pnpm install

# Full typecheck
pnpm run typecheck

# Regenerate API hooks + Zod schemas from the OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push

# Build everything
pnpm run build
```

---

## Environment variables reference

### Frontend (`artifacts/travel-budget/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `VITE_API_BASE_URL` | optional | API server URL (leave empty for local dev) |
| `BASE_PATH` | optional | URL base path (set to `/Wanderlust-Swipe/` for GitHub Pages) |

### API server (`artifacts/api-server/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key (for proxy route) |
| `SESSION_SECRET` | ✅ | Random string for session signing |
| `PORT` | optional | API port (defaults to `8080`) |

---

## Notes

- This is a **pnpm workspace monorepo**. Use `pnpm`, not `npm` or `yarn`.
- The API generates AI-style mock trip data — no real flight/hotel booking APIs required to get started.
- Guest mode lets users browse without signing in; saving trips requires auth.
