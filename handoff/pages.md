# Softgen — Page Spec

> Page-by-page build instructions. Each page lists: route, sections in order, components used, data sources, and notable behavior. Use the prototype HTML as the visual source of truth for spacing and proportions.

The site is a **Next.js 14+ app router** project. Locales live under `[lang]` (`en` | `ka`); all routes below are scoped under `/app/[lang]/`. Default locale is `en`. Visiting `/` redirects to `/en`.

---

## Public site

### `/[lang]` — Home

**Sections (in order):**
1. **Hero** — `HeroBackdrop` + display headline (3 lines, last in primary), eyebrow above, lead below, two buttons (primary + ghost), `FloatingSystemCard` foreground right.
2. **StatsBand** — 4 cells in a `grid-cols-4` divided by 1px verticals. Each cell: large mono number + display label. Counter animates when section enters viewport.
3. **ServicesSection** — `SectionHeader` + 4 `ServiceCard`s in `grid-cols-2`, each linked to `/services/[slug]`.
4. **FeaturedProjects** — `SectionHeader` + asymmetric grid: 1 large card (col-span-2) + 3 normal cards. Each links to `/projects/[slug]`.
5. **PartnerMarquee** — Eyebrow + title + an infinite-scroll marquee of partner names. Two rows in opposite directions. Mask-fades on left/right edges.
6. **NewsTeaser** — `SectionHeader` + 3 latest articles in `grid-cols-3`, plus "All articles →" link aligned to header right.
7. **FinalCTA** — Full-bleed gradient band (primary → primary-deep), large h1 title, subtext, primary button. Subtle dot pattern overlay.
8. `Footer`.

**Data:**
- Stats: hardcoded in `content/stats.ts`.
- Featured projects: pull 4 most recent `published=true featured=true` from `projects` table.
- Partners: pull all from `partners` table sorted by display order.
- News teaser: 3 most recent `published=true` from `articles`.

**Animations:**
- `useReveal` on every section (one-shot, fade + translateY).
- Counter animates only on `inView`.
- Marquee runs continuously; pauses on hover.

---

### `/[lang]/about` — About

**Sections:**
1. **Editorial hero** — Eyebrow ("About Softgen") + h-display headline + lead intro. No background imagery; just type, centered, with generous top padding (160px).
2. **Timeline** — vertical dotted line down the page; 5 milestones (2008/2012/2016/2020/2024) on alternating sides. Each: year (mono primary 16px), title (h3), body. Animate each entry in as it enters viewport.
3. **Commitments / values** — Eyebrow + h2 + 3 values in a `grid-cols-3`. Each: big mono number (`01`/`02`/`03`) + h3 + body.
4. **Team grid** — `SectionHeader` + 6 `TeamMemberCard`s in `grid-cols-3` (2 rows). Each card: square avatar placeholder, name, role, "Since 2017" in mono.
5. `FinalCTA` (reuse).
6. `Footer`.

**Data:** all from `about.json` (or DB-backed `pages.about` row + `team_members` table).

---

### `/[lang]/services` — Services index

**Sections:**
1. **Hero** — Eyebrow ("Services") + h-display + lead.
2. **Four service rows**, full-width, alternating left/right text-vs-figure. Each: number, h2 title, capabilities bullet list (4 items), `LinkUnderline` "View practice →".
3. `FinalCTA`.
4. `Footer`.

**Data:** `services` table (4 rows, each with `slug`, `title_en`, `title_ka`, `tagline_en`, `tagline_ka`, `capabilities` (JSON array of bilingual strings), `related_project_slugs`).

### `/[lang]/services/[slug]` — Service detail

**Sections:**
1. **Breadcrumb** — Services → [Service name].
2. **Hero** — Eyebrow + h-display title + tagline.
3. **Capabilities list** — 2-col grid; each item is an h4 + 1-line description.
4. **Related projects** — 2–3 `ProjectCard`s pulled from `related_project_slugs`.
5. `FinalCTA`.
6. `Footer`.

---

### `/[lang]/projects` — Projects index

**Sections:**
1. **Hero** — Eyebrow + h-display + lead.
2. **Filter tabs** — `All | FinTech | Government | Security | Enterprise`. Updates URL via `?category=`. Client-side filter.
3. **Projects grid** — `grid-cols-3` of `ProjectCard`s, infinite scroll OR pagination at 12 per page.
4. `Footer`.

**Data:** `projects` table. Filter clientside if total ≤ 50; otherwise serverside with searchParams.

### `/[lang]/projects/[slug]` — Case study detail

**Sections:**
1. **Breadcrumb** — Projects → [project title].
2. **Header block** — Category chip + year + title (h-display) + summary (lead).
3. **Hero figure** — full-bleed `Placeholder` (or real image) at aspect 16/9.
4. **Meta row** — 4 `KV` pairs in a row: Client / Duration / Scope / Team. Mono labels, body values.
5. **Tag row** — `Chip`s (outline) for tech stack: `Next.js`, `TypeScript`, etc.
6. **Body** — long-form, max-width 720px, centered. Renders rich text (`p`, `h2`, `h3`, `ul`, `img` with caption, `blockquote`).
7. **Outcome metrics** (optional) — 3 stat cells in a row.
8. **Related projects** — 2 `ProjectCard`s.
9. `Footer`.

**Data:** `projects` table + `project_bodies` (rich-text JSON or markdown per locale).

---

### `/[lang]/news` — News listing

**Sections:**
1. **Hero** — Eyebrow + h-display + lead.
2. **Category tabs** — `All | Engineering | Company | Security | Case studies`. Updates `?category=`.
3. **Featured row** — the most recent `featured=true` article as a wide card (image left 50%, content right 50%).
4. **Articles grid** — `grid-cols-3` of `NewsCard`s.
5. **Pagination** — 9 per page.
6. `Footer`.

### `/[lang]/news/[slug]` — Article detail

**Sections:**
1. **Breadcrumb** — News → [Article title].
2. **Header** — Category chip + date (mono) + title (h1) + excerpt (lead).
3. **Author byline** — avatar (32px) + author name (display 600) + read time (mono tertiary).
4. **Hero figure** — full-bleed `Placeholder` at aspect 16/9.
5. **Body** — long-form, max-width 720px. Same renderer as case study body.
6. **Author footer card** — avatar 64px + name + role + 2-line bio + LinkedIn icon.
7. **Related articles** — 3 `NewsCard`s, same category if possible.
8. `Footer`.

**Data:** `articles` table + `article_bodies`.

---

### `/[lang]/careers` — Careers index

**Sections:**
1. **Hero** — Eyebrow + h-display + lead.
2. **Department tabs** — `All teams | Engineering | Design | Operations`.
3. **Jobs list** — full-width `JobCard` rows, each linked to `/careers/[slug]`.
4. **Empty state** — when no jobs match a filter: "No open roles in [Dept] right now. Write to careers@softgen.ge anyway."
5. `Footer`.

### `/[lang]/careers/[slug]` — Job detail with apply form

**Sections:**
1. **Breadcrumb** — Careers → [Role title].
2. **Header** — Department chip + type chip + location + title (h1).
3. **Job description** — long-form body, max-width 720px. Sections: About the role, What you'll do (bullets), What we're looking for (bullets), Compensation, About Softgen.
4. **Apply form** — `Field` set: Full name, Email, Phone (optional), CV upload (`FileUpload`), Cover note (textarea). Primary submit button.
5. **Success state** — replaces form with `FormSuccess`.
6. `Footer`.

**Form behavior:**
- Required: name, email, CV.
- Email validated via regex.
- CV: PDF/DOC, ≤ 10MB.
- On submit: POST `/api/applications`, store row in `job_applications` table, send notification email to careers@softgen.ge, render `FormSuccess`.

---

### `/[lang]/contact` — Contact

**Sections:**
1. **Hero** — Eyebrow + h-display + lead.
2. **Two-column block:** 60/40 split.
   - Left: contact form (Field: name, work email, phone, company, message). Primary submit.
   - Right: stack of 3 `OfficeCard`s (Tbilisi, Yerevan, Baku). Below offices: `LinkUnderline` "On-call line for existing customers →" with phone number in mono.
3. **Map** (optional) — full-width 400px-tall map embed showing Tbilisi office. Use a styled-dark Mapbox or Google Maps embed.
4. `Footer`.

**Form behavior:**
- Required: name, email, message. Same validation pattern as careers apply form.
- POST `/api/leads` → row in `leads` table with `status='new'` → notification email to sales@softgen.ge → render `FormSuccess`.

---

## Admin panel — `/admin/*`

> Auth-gated. Use `next-auth` with credentials provider against the `users` table. Role enum: `admin`, `editor`. All admin routes 302 to `/admin/login` if no session.

### `/admin/login`
- Centered card on `--bg-deep` background.
- Logo + "Softgen Admin" h2 + subtitle.
- Email + password fields, primary "Sign in" button.
- Error banner: "Invalid credentials" in red on failure.

### `/admin` — Dashboard
**Sections (in `AdminShell`):**
1. `AdminTopbar`: "Dashboard" title.
2. **Quick stats row** — 4 stat tiles in a grid: New leads (last 7d), Published projects, Draft articles, Job applications. Each is a `Card` with mono number + display label + tiny sparkline (optional).
3. **Quick actions** — 4 `Button` (variant `soft`) tiles: New project / New article / Add team member / Add job. Each navigates to the create form.
4. **Recent leads table** — top 5 from `leads`, "View all" link in topbar of card.
5. **Recent activity log** — list of "Levan published 'How we shipped TBC'" entries with timestamps.

### `/admin/projects` — Projects CRUD
- `AdminTopbar`: "Projects" + search + "New project" primary button.
- `AdminTable`:
  - Columns: Title (with thumbnail) · Category · Year · Featured (toggle) · Published (status pill) · Updated · ⋮
  - Click a row → opens `AdminDrawer` with the edit form.
  - "New project" → opens drawer in create mode (slug = "new").
- **Edit drawer fields:**
  - `BilingualField`: title (en/ka)
  - Category (Select)
  - Year (input)
  - `BilingualField`: summary (textarea)
  - `BilingualField`: body (TipTap rich-text editor with toolbar: H2, H3, Bold, Italic, Link, Image, Bullet/Numbered list, Blockquote)
  - Cover image (`FileUpload`)
  - Tags (multi-input pill list)
  - `ToggleField`: Featured
  - `ToggleField`: Published
- Footer: "Delete" (ghost destructive on left) | Cancel + Save (right).

### `/admin/news` — Articles CRUD
Same pattern as projects, with these field differences:
- Category (Engineering/Company/Security/Case studies — Select)
- Author (Select from `users` table where role in admin/editor)
- Read time (number, with auto-suggest based on body word count)
- Date (date picker)
- All other fields mirror projects.

### `/admin/team` — Team members
- Simpler `AdminTable`: avatar + name · role · since · order · ⋮.
- Drawer fields: name, `BilingualField` role, since (year), avatar (`FileUpload`), bio (`BilingualField` textarea), order (number), display on About page (toggle).

### `/admin/partners` — Partners
- Simplest: one row per partner, name + logo + display order. Drag-handle reorder.

### `/admin/pages` — Static pages
- List of editable pages: Home, About, Services, Contact (the static intro/headline copy).
- Each opens a drawer with `BilingualField`s for the relevant strings (eyebrow, headline, lead, etc.).

### `/admin/leads` — Leads CRM
- `AdminTopbar`: "Leads" + search.
- **Filter tabs**: All · New · Contacted · Qualified · Lost — each shows count.
- `AdminTable`:
  - Columns: Name · Email · Company · Source (form/email) · Status (`StatusPill`) · Created · ⋮
  - Click row → `AdminDrawer` with full lead detail.
- **Detail drawer:**
  - Header: name (h2) + status (`StatusPill` w/ dropdown to change).
  - `KV` block: Email, Phone, Company, Source page, Submitted at.
  - Original message in a quoted block.
  - Notes (textarea, append-only timeline of staff comments).
  - Activity log: status changes, who & when.

### `/admin/applications` — Job applications
- Same pattern as leads, columns: Name · Role · Status · Applied · ⋮.
- Detail drawer: name, contact, downloadable CV link, cover note, role link, status (new/reviewed/interview/offer/hired/rejected).

### `/admin/users` — Users (admin role only)
- List + drawer for inviting new admins/editors. Email + role select.

### `/admin/settings` — Settings
- Single page (not a list). Sections:
  - **General**: company info, contact emails, on-call phone.
  - **SEO defaults**: default OG image, default meta description (bilingual).
  - **Integrations**: SMTP credentials (masked), Google Analytics ID.

---

## Database schema (suggested)

Minimal Postgres schema for the dynamic content. Use Drizzle or Prisma.

```sql
-- Bilingual strings stored as JSON: { en: "...", ka: "..." }

CREATE TABLE projects (
  id           uuid PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  title        jsonb NOT NULL,
  category     text NOT NULL,            -- FinTech/Government/Security/Enterprise
  year         int NOT NULL,
  client       text,
  duration     jsonb,
  scope        jsonb,
  team         text,
  summary      jsonb,
  body         jsonb,                    -- TipTap JSON
  cover_url    text,
  tags         text[],
  related      text[],                   -- slugs of related projects
  featured     boolean DEFAULT false,
  published    boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE articles (
  id           uuid PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  category     text NOT NULL,            -- engineering/company/security/case
  title        jsonb NOT NULL,
  excerpt      jsonb,
  body         jsonb,
  author_id    uuid REFERENCES users(id),
  read_time    int,
  date         date,
  cover_url    text,
  accent       text,                     -- indigo/violet/plum
  featured     boolean DEFAULT false,
  published    boolean DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE services (
  slug         text PRIMARY KEY,
  title        jsonb NOT NULL,
  tagline      jsonb,
  body         jsonb,
  capabilities jsonb,                    -- array of bilingual strings
  related      text[],                   -- project slugs
  display_order int DEFAULT 0
);

CREATE TABLE team_members (
  id           uuid PRIMARY KEY,
  name         text NOT NULL,
  role         jsonb NOT NULL,
  since        int,
  bio          jsonb,
  avatar_url   text,
  display_order int DEFAULT 0,
  visible      boolean DEFAULT true
);

CREATE TABLE partners (
  id           uuid PRIMARY KEY,
  name         text NOT NULL,
  logo_url     text,
  display_order int DEFAULT 0
);

CREATE TABLE jobs (
  id           uuid PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  title        jsonb NOT NULL,
  department   text NOT NULL,
  type         text NOT NULL,            -- full_time/part_time/contract
  location     text,
  description  jsonb,
  body         jsonb,
  open         boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE leads (
  id           uuid PRIMARY KEY,
  name         text, email text, phone text, company text,
  message      text,
  source       text,                     -- 'contact_form' | 'careers' | 'manual'
  status       text DEFAULT 'new',       -- new/contacted/qualified/lost
  notes        jsonb DEFAULT '[]',
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE job_applications (
  id           uuid PRIMARY KEY,
  job_slug     text REFERENCES jobs(slug),
  name text, email text, phone text,
  cv_url       text,
  cover_note   text,
  status       text DEFAULT 'new',
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE users (
  id           uuid PRIMARY KEY,
  email        text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name         text,
  role         text NOT NULL,            -- admin | editor
  avatar_url   text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE pages (
  slug         text PRIMARY KEY,         -- 'home' | 'about' | 'services' | 'contact'
  content      jsonb NOT NULL            -- bilingual key/value blob for static copy
);
```

---

## i18n routing

- Use `next-intl` or roll your own. URL pattern: `/[lang]/[...rest]`.
- Always render `<html lang={lang}>`.
- `LangSwitch` swaps `/en/about` ↔ `/ka/about`.
- All bilingual fields render `record[lang] ?? record.en`.

---

## SEO

- `<title>`, `<meta description>`, OG image per page; defaults from `pages.home`.
- Generate sitemap from `projects`, `articles`, `services`, `jobs` published flags.
- `hreflang` alternates: `<link rel="alternate" hreflang="en" href="..."/>` and `ka`.

---

## Performance budget

- LCP < 2.0s on cable. Use `next/image` for all real imagery, with `priority` on hero figure.
- All animations CSS-driven (no JS frame loops except `useCountUp`).
- Marquee uses `transform: translateX` only; no layout thrash.
