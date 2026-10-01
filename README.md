# Prompt Library

A small "Pinterest for prompts": save, search, tag and share your favorite LLM prompts.

## Quick start

```bash
npm install
npm run setup     # copies .env.example to .env, generates Prisma client, creates the SQLite DB
npm run dev       # http://localhost:3000
```

If `setup` complains, run these by hand: `cp .env.example .env`, `npx prisma migrate dev --name init`.

## Scripts

| Command              | What it does                 |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start the dev server         |
| `npm test`           | Run Vitest                   |
| `npm run lint`       | ESLint                       |
| `npm run format`     | Prettier (write)             |
| `npm run db:migrate` | Create/apply a dev migration |

## Stack and why

- **Next.js (App Router, TypeScript)**: one repo, one process, API and UI together.
- **Prisma + SQLite**: zero-setup database, typed queries, many-to-many tags.
- **Auth**: bcrypt password hashes, JWT (jose) in an httpOnly cookie, 7-day expiry.
- **Zod** for input validation, **Tailwind** for styling, **Vitest** for tests.

## Decisions and assumptions

- Prompts are public to read. Only the author can edit or delete.
- Tags are trimmed, lowercased and deduplicated (max 10 per prompt).
- Search uses `contains` on title and body (case-insensitive for ASCII).
- Single-tag filter, page-number pagination, 12 per page.

## Known gaps

No email verification, password reset or rate limiting. Search is not true full-text.

## With more time

Postgres full-text or Meilisearch, stars, markdown rendering, CI, deploy preview.
