# Build Softgen.ge — Prompt for Claude Code / Cursor

> Paste this entire file (or the relevant sections) into your build agent. Reference the other files in this folder by name; the agent should read all of them before writing code.

---

## Role

You are building **softgen.ge**, the corporate website for Softgen LLC — a Tbilisi-based enterprise software company. You have a complete, polished hi-fi design prototype as your visual source of truth, plus four spec documents. Your job is to **translate the prototype into a production Next.js application** without making independent visual decisions.

**The prototype is final. If you have a question about how something should look, the answer is in `prototype.html`. Open it, click the page in question, and copy what you see.**

---

## Read these first, in order

1. **`prototype.html`** — the full clickable design. Open it locally; click every page. This is what you are building.
2. **`design-tokens.md`** — exact color, type, spacing, radii, shadow and motion values. Paste straight into `tailwind.config.ts` and `globals.css`.
3. **`components.md`** — every reusable component with anatomy, props, and behavior.
4. **`pages.md`** — page-by-page section spec, data sources, form behaviors, and the database schema.
5. **`copywriting.md`** — every visible string in EN + KA. Use as the seed for static copy and for `db/seed.ts`.

---

## Stack (locked in)

- **Next.js 14+** (App Router, RSC where it helps).
- **TypeScript strict**.
- **Tailwind CSS** + the config snippet from `design-tokens.md` §8.
- **Postgres** (Neon or Supabase). **Drizzle ORM**.
- **next-intl** for i18n. URL pattern `/[lang]/...`, locales `en` (default), `ka`.
- **next-auth** with credentials provider for `/admin/*`.
- **TipTap** for rich-text editing in admin (project bodies, article bodies).
- **react-hook-form + zod** for all forms (contact, careers apply, admin).
- **Resend** (or SES) for transactional email — lead notifications, application notifications, application confirmations.
- **Vercel Blob** (or S3) for file uploads — CV files, project covers, article covers, team avatars.
- **next/image** for all real imagery.

---

## Hard rules

1. **Do not invent visual styles.** Every color, font size, radius, shadow, and motion value comes from `design-tokens.md`. If you find yourself reaching for a value that isn't there, stop and re-read the prototype.

2. **Do not invent copy.** All visible strings come from `copywriting.md`. If a string is missing, ask before writing it.

3. **Do not skip Georgian.** Every user-visible string has a `ka` value. Render `value[lang]`, not `value.en` with a TODO.

4. **Dark mode is the primary theme.** `<html data-theme="dark">` is the default. Light mode is a secondary toggle (theme switch in nav + footer). Both must be pixel-clean.

5. **The Tweaks panel and the runtime color picker in the prototype are design tooling — do NOT port them.** They exist so the designer could audition shades. The primary color is now locked at **`#4F3EDB`**.

6. **Do not introduce a UI library** (no shadcn, no Material, no Radix beyond what's necessary for accessible primitives like the dropdown and dialog). Build from the spec in `components.md`. You may use **Radix Primitives** as the headless layer for `Dialog` (admin drawer), `Tabs`, `Select`, `Toggle` only — style them yourself per spec.

7. **Animation is part of the design.** Implement scroll-reveal, the stat counter, the marquee, the page enter, and the hero floating composition. Values are in `design-tokens.md` §6.

8. **Accessibility:** every interactive element has a focus-visible ring matching `design-tokens.md` §7. All images need `alt`. Color contrast meets WCAG AA on both themes. Forms have proper `<label for>` associations.

---

## Project structure (target)

```
app/
  [lang]/
    layout.tsx                 # Navbar + Footer + i18n provider + theme provider
    page.tsx                   # Home
    about/page.tsx
    services/page.tsx
    services/[slug]/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    news/page.tsx
    news/[slug]/page.tsx
    careers/page.tsx
    careers/[slug]/page.tsx
    contact/page.tsx
  admin/
    layout.tsx                 # AdminShell wrapper, requires auth
    login/page.tsx
    page.tsx                   # Dashboard
    projects/page.tsx
    news/page.tsx
    team/page.tsx
    partners/page.tsx
    pages/page.tsx
    leads/page.tsx
    applications/page.tsx
    users/page.tsx
    settings/page.tsx
  api/
    leads/route.ts             # POST contact form
    applications/route.ts      # POST job apply
    upload/route.ts            # signed-url generator for blob uploads
    auth/[...nextauth]/route.ts
  globals.css                  # CSS variables from design-tokens.md
components/
  brand/Logo.tsx
  ui/Button.tsx Chip.tsx Eyebrow.tsx Card.tsx Tabs.tsx ...
  layout/Container.tsx Section.tsx Hairline.tsx
  navigation/Navbar.tsx Footer.tsx LangSwitch.tsx ThemeSwitch.tsx
  cards/ProjectCard.tsx ServiceCard.tsx NewsCard.tsx JobCard.tsx OfficeCard.tsx TeamMemberCard.tsx
  forms/Field.tsx Textarea.tsx Select.tsx FileUpload.tsx FormSuccess.tsx
  visual/Placeholder.tsx AvatarPH.tsx HeroBackdrop.tsx FloatingSystemCard.tsx Marquee.tsx
  hooks/useReveal.ts useCountUp.ts
  admin/AdminShell.tsx AdminSidebar.tsx AdminTopbar.tsx AdminTable.tsx AdminDrawer.tsx StatusPill.tsx Toggle.tsx KV.tsx BilingualField.tsx
db/
  schema.ts                    # Drizzle schema from pages.md
  seed.ts                      # seed from copywriting.md
  index.ts
lib/
  i18n.ts                      # next-intl helpers + t()
  auth.ts
  blob.ts
  email.ts
content/
  static.ts                    # the bilingual JSON blocks from copywriting.md
public/
  fonts/                       # Plus Jakarta Sans, Inter, JetBrains Mono (local)
```

---

## Build order (recommended)

### Phase 1 — Foundations (1-2 days)
1. Spin up Next.js with the stack above. Add `next-intl` with `en`/`ka` and the `/[lang]` route group.
2. Drop in `globals.css` from `design-tokens.md` §1–§5. Verify dark mode is default.
3. Add fonts. Use `next/font/local` for Plus Jakarta Sans + Inter + JetBrains Mono. Confirm Georgian glyphs render.
4. Build the **Tailwind config** from `design-tokens.md` §8.
5. Build the brand + layout primitives: `Logo`, `Container`, `Section`, `Hairline`, `Eyebrow`, `Chip`, `Button` (all variants), `LinkUnderline`.
6. Build `Navbar` (with `LangSwitch` + `ThemeSwitch`) and `Footer`.

### Phase 2 — Public pages, hardcoded copy (3-4 days)
Use `content/static.ts` for all copy — no DB yet.
1. **Home** (`pages.md` §Home). Components: `Hero` + `HeroBackdrop` + `FloatingSystemCard`, `StatsBand`, `ServicesSection`, `FeaturedProjects`, `PartnerMarquee`, `NewsTeaser`, `FinalCTA`.
2. **About** — timeline, commitments, team grid (`AvatarPH` for now).
3. **Services** + service detail.
4. **Projects** + project detail.
5. **News** + article detail.
6. **Careers** + job detail (form is a stub `console.log`).
7. **Contact** (form stub).

Compare every page against `prototype.html`. Spacing, type sizes, hover states, scroll-reveal. Match it.

### Phase 3 — Database + seeding (1-2 days)
1. Drizzle schema from `pages.md` §"Database schema".
2. `db/seed.ts` — load `copywriting.md` content into `services`, `projects`, `articles`, `team_members`, `partners`, `jobs`, `pages`, `users` (one admin: `levan@softgen.ge`).
3. Wire each public page to read from DB instead of `content/static.ts`. Pages stay RSC + cached.

### Phase 4 — Forms + email (1 day)
1. Contact form → `POST /api/leads` → insert + email to `sales@softgen.ge` (Resend).
2. Apply form → `POST /api/applications` → upload CV via signed URL → insert + email to `careers@softgen.ge` + confirmation to applicant.

### Phase 5 — Admin (3-4 days)
Order by complexity:
1. `next-auth` credentials provider, login page, middleware that protects `/admin/*`.
2. `AdminShell` + `AdminSidebar` + `AdminTopbar`.
3. **Dashboard** (read-only stats from DB).
4. **Leads CRUD** — list, status change, notes append. (Easier than projects, builds confidence.)
5. **Projects CRUD** with TipTap editor and image uploads.
6. **News CRUD** (mostly identical to projects).
7. **Team / Partners / Jobs / Pages / Users / Settings** — all simpler.

### Phase 6 — Polish (1-2 days)
1. SEO: per-page `<title>`, `<meta description>`, OG image, canonical, hreflang alternates.
2. Sitemap + robots.txt.
3. 404 + 500 pages — match the design system.
4. Performance: Lighthouse 95+ on desktop, real images via `next/image`, fonts subset to Latin + Georgian.
5. Accessibility audit — keyboard nav through every page, screen-reader spot check.

---

## Things to ask before doing them differently

- **Adding any visual element not in the prototype** (banners, badges, stickers, "new" callouts) — ask first.
- **Adding a new route or page** — ask first.
- **Replacing a placeholder visual with stock imagery** — ask. The placeholders are deliberate. Real images come from the customer.
- **Changing form fields** (adding/removing) — ask. The current set is deliberate.
- **Choosing icons** — pick from **Lucide React**, sized 16/20/24px. Never mix icon sets.

---

## Definition of done

- [ ] Every public page renders on `/en/*` and `/ka/*` with correct copy, no English bleeding into KA.
- [ ] Light + dark mode both pixel-clean. No `--primary-soft` regressions in either.
- [ ] All hover, focus, and active states match prototype.
- [ ] Contact form submits, persists to DB, sends email.
- [ ] Apply form submits, uploads CV, persists, sends email.
- [ ] Admin can: log in, edit a project (incl. body via TipTap, cover image), publish it, see it on `/projects/[slug]`.
- [ ] Admin can: see a lead in `/admin/leads` within seconds of submission, change its status, see the change persist.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (mobile + desktop).
- [ ] Sitemap.xml lists every published project, article, job, plus all static pages, in both locales.
- [ ] No console errors or warnings in production build.

---

## When you're stuck

1. Open `prototype.html` and click to the screen in question.
2. Inspect the DOM. The class names are utility-style and the inline styles are explicit. Copy them.
3. If the answer isn't visible — search the spec docs (Cmd+F across `handoff/`).
4. If still stuck, **stop and ask** — don't improvise visuals.

---

## Out of scope (don't build these now)

- Mobile design beyond default responsive behavior. Current scope is desktop-first; mobile work is a separate engagement.
- The Tweaks panel and the runtime primary-color picker. Design tooling only.
- Multi-tenant / white-label features.
- Analytics dashboards beyond the basic admin home tiles.
- Public API endpoints beyond what's in `pages.md` §"Database schema".

---

Good luck. The design is opinionated and the spec is detailed — your job is fidelity, not invention.
