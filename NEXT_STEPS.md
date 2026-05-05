# Softgen.ge — Build Status & Next Steps

This document tracks every phase of `handoff/build-prompt.md` plus the
production-ready add-ons that were not in the original spec but are needed
for handover (Docker, prod compose, runbook).

---

## What's done

### Phase 1 — Foundations ✅
- Next.js 15 (App Router) + TypeScript strict + Tailwind 3 + next-intl 3.
- `/[lang]` routing (`en` default, `ka`); `middleware.ts` handles the prefix; `/` redirects to `/en`.
- `app/globals.css` carries the full design-token system from `handoff/design-tokens.md` + the prototype's `styles.css`.
- Dark mode default; `ThemeProvider` persists in `localStorage`; inline boot script sets `data-theme` before paint (no FOUC).
- `tailwind.config.ts` extends with the purple/ink palettes, semantic vars, fonts, radii, shadows, easings, 1280px container.
- Fonts via `next/font/google` (Plus Jakarta Sans, Inter, JetBrains Mono) — Latin + Latin-ext for Georgian.
- `content/static.ts` carries the bilingual `CONTENT` blob — every visible string in EN + KA, transcribed from the prototype's `content.jsx`.

### Phase 2 — Public pages ✅
| Route | Section composition |
|---|---|
| `/` → `/en` | redirect |
| `/[lang]` | Hero + StatsBand + ServicesSection + FeaturedProjects + PartnerMarquee + NewsTeaser + FinalCTA |
| `/[lang]/about` | Editorial hero + Timeline + Values + TeamGrid + FinalCTA |
| `/[lang]/services` + `/[slug]` | rows + breadcrumbed detail with capabilities + related projects |
| `/[lang]/projects` + `/[slug]` | filtered grid + case-study detail with KV meta + tags |
| `/[lang]/news` + `/[slug]` | featured + grid + article detail with author byline + "Continue reading" |
| `/[lang]/careers` + `/[slug]` | dept tabs + job rows + sticky `ApplyForm` |
| `/[lang]/contact` | form + offices |
| `*` | locale-aware + root `not-found.tsx` |

### Phase 3 — Database + seeding ✅
- `db/schema.ts` (Drizzle) mirrors `handoff/pages.md` schema — 10 tables, JSONB bilingual columns.
- `db/index.ts` lazy client with `connect_timeout: 5` (so a misconfigured `DATABASE_URL` fails fast in build contexts instead of hanging Next's static-page worker).
- `db/seed.ts` (TS, dev) and `db/seed.mjs` + `content/static.json` (plain Node, prod) load every row from CONTENT and create the admin user.
- `db/migrate.mjs` is a tiny Drizzle migration runner (reads `db/migrations/*.sql`, applies in order, tracked in `drizzle.__drizzle_migrations`).
- `drizzle.config.ts` loads `.env.local` then `.env`.
- `.env.example` + `pnpm db:push` / `db:migrate` / `db:seed` / `db:studio` scripts.

### Phase 4 — Forms + email ✅
- `lib/email.ts` — Resend wrapper with **console fallback** when `RESEND_API_KEY` is missing.
- `lib/blob.ts` — Vercel Blob wrapper with **local-disk fallback** to `public/uploads/` when `BLOB_READ_WRITE_TOKEN` is missing.
- `POST /api/leads` — zod-validated, inserts into `leads`, fires-and-forgets a notification email. Notify-to address resolved at runtime from `pages.settings.general.salesEmail` (env var fallback). 503 with friendly message if DB is missing.
- `POST /api/applications` — multipart, accepts `cv` File (≤10MB) or `cv_url`, stores via `lib/blob`, inserts into `job_applications`, sends notification + applicant confirmation. Notify-to via `pages.settings.general.careersEmail`.
- `ContactForm` + `ApplyForm` wired to the APIs with pending state, error rendering, "backend not configured" friendly fallback.

### Phase 5 — Admin ✅
Full CRUD across all 11 areas, all server actions auth-gated:
- `lib/auth.ts` next-auth credentials provider against `users` table, JWT sessions, role on the JWT.
- `middleware.ts` splits: `/admin/*` → JWT check, everything else → next-intl.
- `app/admin/layout.tsx` (AdminShell): sidebar + content on `--bg-deep`. `/admin/users` and `/admin/settings` are admin-only.
- `/admin/login`, `/admin` (dashboard), `/admin/leads` (list + detail w/ status select + notes append), `/admin/projects`, `/admin/news`, `/admin/team`, `/admin/partners`, `/admin/jobs`, `/admin/applications`, `/admin/pages` (JSON editor), `/admin/users`, `/admin/settings`.
- Shared components: `AdminSidebar`, `AdminTopbar`, `AdminDrawer` (Radix Dialog), `BilingualField`, `Toggle`, `FileUpload`, `TipTapEditor`, `AdminSelect`, `TagsInput`, `KV`, `StatusPill`, `PublishStatusPill`, `ApplicationStatusSelect`, `NotesPanel`.
- `/api/admin/upload` — auth-gated multipart endpoint that wraps `lib/blob` (4 MB cap, 10 MB for `cvs/`).

### Phase 6 — Polish ✅
- `app/sitemap.ts` reads from DB (every published project / article / service / job × both locales).
- `app/robots.ts` — disallow `/admin/`, `/api/`, points to sitemap.
- `lib/seo.ts` + `generateMetadata` on every public page → per-page `<title>`, description, canonical, OG, hreflang alternates for EN/KA + `x-default`. **Defaults pulled from `pages.settings.seo` so the admin can change site-wide title / description / OG image without a redeploy.**
- `app/error.tsx` — 500 page styled to design system, surfaces `error.digest` for support.
- `lib/dbContent.ts` — cached server-side queries with graceful `content/static.ts` fallback when the DB is unreachable. Used by every public page and the sitemap.
- `lib/renderBody.tsx` — handles both the prototype's `[{type, text}]` body shape and full TipTap ProseMirror JSON via `@tiptap/html`. Same `body-prose` styling.
- `lib/settings.ts` — runtime accessor for `pages.settings`, cached + DB-fallback-safe.
- Dark/light parity for `--danger` and status-pill palettes (Contacted / Qualified / Lost) per `design-tokens.md` §1.4.
- Hero floating system-health card hides below 1100px; Footer collapses 4-col → 2-col below 900px → 1-col below 520px.

### Production readiness ✅ (added in handover phase)
- `next.config.mjs` → `output: 'standalone'` for ~150 MB runner image.
- `Dockerfile` — multi-stage (deps → builder → runner) Alpine, non-root `nextjs` user, healthcheck via `/api/health`.
- `.dockerignore` — excludes `.env*`, `handoff/`, `public/uploads/`, build artifacts.
- `docker-compose.dev.yml` — Postgres 16 on port **5440** (chosen to avoid clashing with avto on 5433 + warehouse on 5432); volume `softgen-pg-data`.
- `docker-compose.prod.yml` — `name: softgen-prod` for project isolation; app + Postgres on internal docker network, only the app's port exposed; named volumes `softgen-pg-prod-data` and `softgen-uploads`; healthcheck + `restart: unless-stopped`; full env-var overrides.
- `db/migrate.mjs` + `db/seed.mjs` — plain Node (no tsx) so the standalone runner can execute them. `Dockerfile` installs `postgres@3.4.9` + `bcryptjs@3.0.3` into `/app/node_modules` since Next standalone trace bundles them into webpack chunks (not discoverable as packages).
- `scripts/build-content-snapshot.mjs` — emits `content/static.json` at build time so the prod seed can read CONTENT without a TS toolchain.
- `app/api/health/route.ts` — JSON liveness + readiness probe.
- `.env.production.example` — full template with comments for every key.
- `DEPLOY.md` — operational runbook for the handover dev (TLS via Caddy/nginx, backups, log tailing, password resets, troubleshooting matrix).

### Verification
- `pnpm build` — **66 routes** compile clean. No type errors, no warnings.
- `pnpm dev` smoke test (port 3005, DB on 5440):
  - Every public route 200 in both locales.
  - Admin login works against the seeded user (`levan@softgen.ge` / `ChangeMe!2026`); session cookie set, all gated `/admin/*` routes reachable.
  - `POST /api/leads` inserts into `leads`, lead row visible at `/admin/leads`, console-fallback email logged.
  - `/api/health` returns `{"ok":true,"db":"up"}`.
- `docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build` — **prod stack verified end-to-end** on port 3006:
  - `node db/migrate.mjs` applies the initial SQL migration.
  - `node db/seed.mjs` loads CONTENT + creates admin user.
  - All 14 smoke-tested public routes return 200.
  - Admin sign-in works; `/admin` returns 200 with the cookie.
  - `POST /api/leads` returns 201, row persists in the prod Postgres volume, email fallback logged.

---

## Setup checklists

### Dev (your laptop)
```bash
cd website
pnpm install
docker compose -f docker-compose.dev.yml up -d   # Postgres on host port 5440
cp .env.example .env.local                        # already populated for local Postgres
pnpm db:push                                      # sync schema (drizzle-kit)
pnpm db:seed                                      # load CONTENT + admin user
pnpm dev                                          # http://localhost:3005
```

### Prod (the deploy host)
See [`DEPLOY.md`](./DEPLOY.md) — full step-by-step including TLS via Caddy/nginx, backups, password resets, log tailing, troubleshooting matrix.

Quick path:
```bash
git clone <repo> softgen-web && cd softgen-web
cp .env.production.example .env.production       # then edit secrets
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/migrate.mjs
docker compose -f docker-compose.prod.yml --env-file .env.production exec app node db/seed.mjs
```

---

## What's still pending

Everything in the build-prompt is done. The list below is **post-handover polish** the dev or future contractor can pick up at any time.

| | |
|---|---|
| Replace `next/font/google` with `next/font/local` using `handoff/_extract/*.woff2` | Faster first paint, offline-resilient. Nothing breaks today. |
| Real Resend account + verified domain | Without it, lead/application emails are logged to container stdout. Free tier is 3 000 emails/month. |
| Real Vercel Blob token | Without it, CV + image uploads write to the `softgen-uploads` named volume. Required if you ever scale to multiple app instances behind a load balancer. |
| Inject Google Analytics if `pages.settings.integrations.googleAnalyticsId` is set | The setting is editable today but the `<script>` injection isn't wired into `app/layout.tsx`. |
| Lighthouse pass (target ≥ 90 perf, ≥ 95 a11y / best-practices / SEO) | Not run yet. |
| Keyboard navigation audit | Not run yet — focus rings already in place via `:focus-visible`. |
| User's visual fixes | Open `http://localhost:3005`, list anything that looks off, hand them over. |
| Soft-delete pattern for content (currently hard delete) | Optional — admin currently deletes rows permanently. Adding `deleted_at` + filtering queries would let editors undo. |
| Activity log on `/admin` dashboard ("Levan published 'How we shipped TBC'") | Stub-only today. Drizzle `audit_log` table + a small middleware-style logger in each server action would close it. |

---

## Build / dev commands

```bash
pnpm dev              # http://localhost:3005
pnpm build            # production build (currently 66 routes)
pnpm start            # serve production build on 3005
pnpm typecheck        # tsc --noEmit, strict
pnpm db:push          # sync Drizzle schema → live DB (dev only — uses --force)
pnpm db:generate      # generate a new SQL migration when schema.ts changes
pnpm db:migrate       # apply migrations via db/migrate.mjs (dev or prod)
pnpm db:studio        # browser DB UI
pnpm db:seed          # load CONTENT into a fresh DB (TS version, dev)
```

```bash
# Dev Docker
docker compose -f docker-compose.dev.yml up -d         # Postgres only, port 5440
docker compose -f docker-compose.dev.yml down          # stop, keep volume
docker compose -f docker-compose.dev.yml down -v       # ⚠ destroys the volume

# Prod Docker (detailed in DEPLOY.md)
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f app
```

---

## Source-of-truth pointers

When a question comes up about how something should look or behave:

1. `handoff/prototype.html` — visual final word.
2. `handoff/_extract/` — the prototype's React source extracted from the bundle (`002_53d93db3.js` Home, `003_222a7f89.js` shared chrome, `005_79cac8d0.js` services/projects/careers/contact, `008_234dc3a0.js` about/news, `009_5e70aa3b.js` content + i18n, `010_2cc28bcd.js` admin, `_template_decoded.html` styles + font @font-face). Re-extract via `node handoff/extract.cjs`.
3. `handoff/design-tokens.md` — values to paste, never invent.
4. `handoff/components.md` — component anatomy + props.
5. `handoff/pages.md` — sections per page + database schema.
6. `handoff/copywriting.md` — every visible string EN + KA.
7. `DEPLOY.md` — handover runbook for the deploy engineer.

The build-prompt's hard rule is intact: **no copy invented; no visual decisions outside the prototype**.
