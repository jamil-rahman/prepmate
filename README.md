# CRISC Quiz App (Demo)

Practice multiple‑choice questions across the four CRISC domains with detailed explanations.

## Features

- Demo‑first access (no sign‑in required)
- Domain selection and mixed quiz mode
- Questions always randomized
- Explanations shown instantly after selection
- Mobile‑first, accessible UI (AODA‑compliant)
- Optimized client, ensuring to leverage all Next.JS has to offer for that speed and performance
- Optional Google Sign‑In

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 
- Prisma ORM + Supabase Postgres
- Firebase Auth (Google)

## Project Structure

```
src/
  app/
    api/
      questions/route.ts       # Public (demo) questions API – Node runtime
      user/route.ts            # User upsert after login (optional)
    auth/                      # Google sign‑in page
    domains/                   # Domain selection
    quiz/                      # Quiz page
    layout.tsx, page.tsx, globals.css
  components/
    domains/DomainCard.tsx, AllDomainsCard.tsx
    home/Hero.tsx, StatsRow.tsx, CTA.tsx
    quiz/QuizHeader.tsx, Progress.tsx, reducer.ts, useQuestions.ts
    QuestionCard.tsx, ui/Button.tsx, Navbar.tsx
  lib/                         # prisma, firebase, auth context
  types/                       # shared TypeScript types
prisma/
  schema.prisma, seed.ts
```

## Getting Started

### 1) Prerequisites
- Node.js 18+ (LTS recommended)
- npm / pnpm / yarn
- Supabase project (Postgres)
- Firebase project (Auth)

### 2) Install
```bash
npm install
```

### 3) Environment Variables
Add these to a `.env` file (and to Vercel Project → Settings → Environment Variables):

```
# Database (Supabase Postgres)
# Prefer the pooled connection string for serverless (Transactions mode):

# Firebase client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Firebase Admin (server)
# JSON string of service account
# e.g. {"project_id":"...","client_email":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"}
FIREBASE_SERVICE_ACCOUNT_KEY={...}
```

Notes:
- In Vercel, use the Supabase pooled connection string (recommended) or add `sslmode=require` to direct connections.
- Keep all secrets out of git. This project reads env from runtime; redeploy after changing envs.

### 4) Database & Prisma
```bash
# Generate client
npm run prisma:generate

# Create / update schema (local dev)
npm run prisma:migrate

# Seed sample questions (32)
npm run prisma:generate && npm run build # ensures client exists
npm run prisma:studio # optional UI to inspect
```

### 5) Run
```bash
# Dev
npm run dev

# Production build
npm run build
npm start
```





## Scripts

- `dev` – Next dev server
- `build` – Prisma generate + Next build
- `start` – Start production server
- `prisma:generate` – Generate Prisma client
- `prisma:migrate` – Run dev migration
- `prisma:studio` – Open Prisma Studio

---

This project is structured for scalability: demo‑first today; optional auth and analytics (attempt history, domain insights) can be enabled in future releases
