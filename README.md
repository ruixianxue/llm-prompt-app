# Prompt Library

A small "Pinterest for prompts". Browse, search and filter LLM prompts by tag, copy one to the clipboard in one click, and sign up to share your own.

## Quick start

Needs Node 20+ and npm.

```bash
npm install
npm run setup
npm run dev
```

Open http://localhost:3000.

`npm run setup` copies `.env.example` to `.env` (only if `.env` does not exist yet), creates the SQLite database, applies migrations and seeds demo data. It is safe to run again.

**Demo login** (local only, created by the seed): `demo@example.com` / `demo-password-123`

Before deploying anywhere, set a real secret in `.env`:

```bash
openssl rand -base64 32
```

## Features

| Feature                                       | Status  |
| --------------------------------------------- | ------- |
| Sign up, log in, log out (email + password)   | Done    |
| All-prompts list, newest first, 12 per page   | Done    |
| Search title and body (case-insensitive)      | Done    |
| Filter by one tag, with prompt counts per tag | Done    |
| Prompt detail page with Copy button           | Done    |
| Create a prompt (logged in)                   | Done    |
| Edit and delete a prompt (author only)        | Not yet |
| Responsive layout (1, 2 or 3 columns)         | Done    |
| Happy-path integration test                   | Not yet |

## Scripts

| Command                | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `npm run setup`        | Create `.env`, migrate and seed the database    |
| `npm run dev`          | Start the dev server on port 3000               |
| `npm test`             | Run the Vitest unit tests                       |
| `npm run lint`         | ESLint (Next.js + TypeScript rules)             |
| `npm run format`       | Format everything with Prettier                 |
| `npm run format:check` | Check formatting without writing (for CI)       |
| `npm run build`        | Production build (also type-checks)             |
| `npm run db:migrate`   | Create and apply a migration after schema edits |
| `npm run db:seed`      | Reset the demo user's 15 prompts                |

To browse the database in a web UI: `npx prisma studio`.

## API

All bodies are JSON. Errors look like `{ "error": "Human readable message" }`.

| Method | Path                 | Auth   | Description                                                              |
| ------ | -------------------- | ------ | ------------------------------------------------------------------------ |
| POST   | `/api/auth/register` | No     | `{ email, password }` -> 201, sets the session cookie. 409 if taken      |
| POST   | `/api/auth/login`    | No     | `{ email, password }` -> 200, sets the session cookie. 401 if wrong      |
| POST   | `/api/auth/logout`   | No     | Clears the session cookie -> 204                                         |
| GET    | `/api/prompts`       | No     | `?q=&tag=&page=` -> `{ items, page, pageSize, total, totalPages }`       |
| POST   | `/api/prompts`       | Yes    | `{ title, body, tags }` -> 201 `{ prompt }`. 400 invalid, 401 logged out |
| GET    | `/api/prompts/:id`   | No     | -> `{ prompt }`, or 404                                                  |
| PATCH  | `/api/prompts/:id`   | Author | Not implemented yet (501)                                                |
| DELETE | `/api/prompts/:id`   | Author | Not implemented yet (501)                                                |
| GET    | `/api/tags`          | No     | -> `{ tags: [{ name, count }] }`, only tags in use, A to Z               |

A prompt looks like this:

```json
{
  "id": "cmu...",
  "title": "Code reviewer",
  "body": "Review this code for bugs...",
  "tags": ["coding", "review"],
  "authorId": "cmu...",
  "createdAt": "2026-09-17T10:20:24.493Z",
  "updatedAt": "2026-09-17T10:20:24.493Z"
}
```

`tags` can be sent as `"a, b"` or `["a", "b"]`.

Try it:

```bash
curl "localhost:3000/api/prompts?q=code&tag=coding"
```

## Project structure

```
prisma/
  schema.prisma        User, Prompt, Tag (Prompt <-> Tag is many-to-many)
  migrations/          SQL migrations
  seed.mjs             demo user + 15 prompts
src/lib/
  auth.ts              bcrypt hashing, JWT session cookie, getCurrentUser
  db.ts                shared Prisma client
  prompts.ts           pure helpers: buildWhere, parsePage, listHref, toPromptDto
  queries.ts           database reads shared by pages and API: listPrompts, getPrompt, listTags
  tags.ts              normalizeTags
  validation.ts        Zod schemas for credentials and prompts
src/components/        Header, AuthForm, LogoutButton, PromptCard, PromptForm, CopyButton
src/app/
  page.tsx             home: search, tag chips, cards, pagination
  login, register      auth pages
  prompts/new          create form
  prompts/[id]         detail page with Copy
  prompts/[id]/edit    edit page (stub)
  api/                 REST routes (see API above)
tests/lib.test.ts      unit tests for tags, filters, pagination links and validation
```

## Stack and why

- **Next.js (App Router, TypeScript).** UI and REST API in one project and one process. Server components read the database directly, so most pages need no client JavaScript.
- **Prisma + SQLite.** No database server to install. Typed queries and readable migrations. Moving to Postgres is mostly a change of provider and URL.
- **bcryptjs + jose.** Pure JavaScript, so there are no native builds to break on install.
- **Zod.** One schema both validates input and cleans it (trims text, normalizes tags).
- **Tailwind.** Fast responsive styling without writing CSS files.
- **Vitest + ESLint + Prettier.** Fast tests and consistent code with almost no config.

## How auth works

1. On register, the password is hashed with bcrypt (cost 10). The plain password is never stored.
2. On register or login, the server signs a JWT (HS256, 7 days) holding the user id, and sets it in a `session` cookie that is `httpOnly`, `sameSite=lax`, and `secure` in production.
3. On each request, `getCurrentUser()` verifies the JWT and loads the user. An expired or tampered token counts as logged out.
4. Logout deletes the cookie.

Login gives the same error for an unknown email and a wrong password, and runs bcrypt in both cases, so attackers cannot tell which emails exist.

## Decisions and assumptions

- Prompts are public to read. Only logged-in users can create. Only the author will be able to edit or delete.
- The author is always taken from the session, never from the request body.
- Author emails are never sent to the browser. Your own prompts are marked "Yours" instead.
- Tags are trimmed, lowercased and deduplicated. More than 10 tags, or a tag over 30 characters, is rejected with a 400 (not silently cut).
- Search uses Prisma `contains` on title and body. One tag filter at a time. Search and tag can be combined.
- Page-number pagination, 12 per page, newest first. A page past the end returns an empty list, not an error.
- Filters live in the URL (`/?q=sql&tag=coding&page=2`), so any view can be shared or bookmarked.
- Sessions last 7 days. No email verification or password reset.

## Known gaps

- **Edit and delete are not built yet.** The routes return 501 and the edit page is a stub.
- **No integration test yet.** Only unit tests for the pure helpers and validation.
- **No rate limiting** on login or register.
- **The auth form can get stuck** on "Please wait..." if the network fails. The prompt form handles this already.
- **Some validation messages on register are raw Zod text**, e.g. a missing password.
- **Two sign-ups with the same email at the same moment** give the second one a 500 instead of a 409.
- **Search is not full-text.** `contains` is case-insensitive only for ASCII on SQLite, and `%` or `_` act as wildcards because Prisma does not escape them.
- **Tags whose prompts were all deleted stay in the database.** They are hidden from the UI and API.
- **No CSRF token.** It relies on `sameSite=lax` cookies plus JSON-only request bodies.

## With more time

1. Edit and delete, then an integration test (register, create, list, search, edit, delete) against a separate test database.
2. Fix the auth form gaps above and add rate limiting on login.
3. Postgres with real full-text search (or Meilisearch), and multi-tag filters.
4. Usernames, so authors can be shown publicly without exposing emails.
5. Stars or favorites, and a "My prompts" page.
6. Markdown rendering and `{variable}` fill-in fields before copying.
7. CI (lint, format check, tests, build on every push) and a deploy preview.
