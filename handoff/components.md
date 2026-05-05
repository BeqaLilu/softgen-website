# Softgen — Component Spec

> Every reusable UI primitive in the prototype. Build these first; pages compose from them. All components ship in TypeScript + Tailwind. Names match the prototype's React names where possible.

---

## Layout primitives

### `Container`
Centers content, max-width 1280px, gutter 32px.
```tsx
<div className="mx-auto max-w-container px-8">{children}</div>
```

### `Section`
```tsx
<section className="py-[120px]">{children}</section>     // .section
<section className="py-20">{children}</section>           // .section-tight (80px)
```

### `Hairline`
1px horizontal divider in `--border`.
```tsx
<div className="h-px w-full bg-border" />
```

---

## Brand

### `Logo`
- Wordmark "Softgen" in Plus Jakarta Sans 700, with an SVG glyph (a stylized "S" in primary).
- Glyph is 28px square by default; wordmark is 18px text.
- Always linked to `/`.

### `Eyebrow`
Small uppercase label preceded by a 24×1px rule.
- Color: `var(--primary)` in light, `#C4B7FF` (purple-300-ish) in dark.
- Font: display 600, 12px, tracking 0.12em, uppercase.

```tsx
<div className="eyebrow">{children}</div>
```

```css
.eyebrow::before { content: ""; width: 24px; height: 1px; background: currentColor; }
```

### `Chip` / status pill
- Default: `--primary-soft` bg, `--primary` text (light) or `#C4B7FF` (dark).
- Outline variant: transparent bg, 1px `--border-strong`, secondary text.
- Padding `6px 12px`, radius `--radius-full`, display 600, 12px.

```tsx
<Chip variant="solid|outline">FinTech</Chip>
```

---

## Buttons

### `Button`
Variants: `primary` (purple fill), `ghost` (border + text), `soft` (primary-soft bg).
Sizes: `sm`, `md` (default), `lg`.

```tsx
<Button variant="primary" size="lg">Start a project</Button>
```

- Display font, 600, 15px (md). Letter-spacing `-0.01em`.
- Radius `--radius-md` (8px).
- `transform: scale(0.98)` on `:active`.
- Primary hover → `--primary-deep` background + `--shadow-purple`.
- Ghost hover → border becomes `--text-primary`.
- Soft hover → fills with primary, text white.
- All transitions 150ms `ease-out`.

### `LinkUnderline`
Inline link with a 1px underline that grows its gap by 4px on hover and shifts color to primary.
Use for "Read article →", "All projects →".

---

## Navigation

### `Navbar`
Fixed top, full-width, height 72px.
- Backdrop: when scrolled (`window.scrollY > 8`), background becomes `var(--bg)/0.85` with `backdrop-filter: blur(20px)` and a 1px bottom border in `--border`. Before scroll, transparent.
- Inner container at `--max-w` width, gutter 32px.
- Layout: logo (left) — primary nav links (centered or left-aligned per design preference) — utilities (right: lang switch + theme switch + primary CTA).
- Active link: text in `--text-primary`, with a small primary-color dot or pill background `--primary-soft`. Inactive: `--text-secondary`.
- Nav links use `--font-display`, 600, 14px.
- The "Start a project" button is the primary CTA on the right; it's `Button` variant `primary`, size `sm`.

### `LangSwitch`
Inline pill toggle showing `EN | KA` (currently selected one in `--surface` w/ shadow, the other in `--text-tertiary`).
- Font mono, 12px, uppercase.
- Persists choice in app state (in production: store in cookie + URL param `/en/...` `/ka/...` for SEO).

### `ThemeSwitch`
Icon button (sun/moon) toggling `data-theme` on `<html>`.
- 36×36, radius full, ghost border. Click rotates the icon.
- Persists choice in `localStorage`.

### `Footer`
Multi-column on desktop:
1. Brand block: logo, tagline, address, contact email/phone.
2–4. Three link columns: **Company** (about, news, careers), **Work** (services, projects), **Legal** (privacy, terms).
5. Language and theme switches inline at bottom-left, copyright "© 2026 Softgen LLC. All rights reserved." right-aligned.
- Background `var(--bg-deep)` (a touch deeper than the page).
- Top border 1px `--border`.
- Padding `80px 0 40px`.

---

## Cards

### `Card` (base)
```tsx
<div className="bg-surface border border-border rounded-lg transition-all hover:border-border-strong">
  {children}
</div>
```

- Always 1px border + 12px radius. NO heavy elevation by default.
- Hover: border darkens to `--border-strong`. Optional: translate up 2px and add `--shadow-sm`.

### `ProjectCard` (homepage featured grid + projects index)
- Asymmetric: featured uses 2-col span and includes a large `Placeholder` cover; smaller cards use 1-col span and a square cover.
- Anatomy:
  1. `Placeholder` cover (aspect 16/10 large, 4/3 small). Has a hover state: image scales to 1.04 over 600ms.
  2. Body padding 28px:
     - Top row: category chip (outline) + year (mono, secondary)
     - Project title (h3, display, 700)
     - Optional one-line description (lead-secondary, 2 lines max)
     - Bottom: `LinkUnderline` "Read case study →"

### `ServiceCard` (homepage 4-up + services index)
- Numbered (`01`, `02`...) — number in mono, primary, very large (48px) at top.
- Title h3, body in `--text-secondary`.
- Hover: arrow icon translates 4px right, border tightens.
- Always linked to `/services/[slug]`.

### `NewsCard`
- Optional small cover (aspect 4/3) at top.
- Anatomy:
  1. Top row: category chip + date (mono, tertiary, format `MAR 13, 2026`)
  2. Title h3 (display, 600 — slightly lighter than project title; news is text-forward).
  3. Excerpt (2-line clamp).
  4. Author byline (avatar 24px + name in display 500, 13px) + read time (`9 min read`, mono tertiary).

### `JobCard` (careers index)
- One row per job, full-width.
- Anatomy: title (h3) — department chip — type chip — location (text-secondary) — `LinkUnderline` "View role →" right-aligned.
- Hover: row tints to `--bg-soft`, "View role →" gap grows.
- 1px bottom border between rows; no visible card frame.

### `OfficeCard` (contact page)
- City as h3 + role chip (e.g. "Headquarters").
- Address in `--text-secondary`.
- Phone in mono.
- Bottom: `LinkUnderline` "Open in Maps →".

### `TeamMemberCard` (about page)
- Square avatar `Placeholder` (aspect 1/1).
- Name h4 + role secondary + "Since 2008" in mono tertiary.
- 6 across in a `grid-cols-3` (2 rows).

---

## Typography components

### `SectionHeader`
Stacks: `Eyebrow` → title (`h2`) → optional `lead`.
- Default left-aligned with `marginBottom: 56px`.
- Centered variant available; max-width 720px when centered.

### `Display`
Big hero headline. Three lines by default; the **last line is colored `--primary`** (or `purple-300` in dark mode) — this is the brand signature on every page hero.

```tsx
<h1 className="h-display">
  <span>Software</span><br/>
  <span>that runs</span><br/>
  <span className="text-primary">the business.</span>
</h1>
```

---

## Visual / placeholder

### `Placeholder` (project covers, hero figures, article hero)
SVG-based abstract composition in three brand-adjacent palettes (`indigo`, `violet`, `plum`). Contains:
- A radial-gradient base.
- 1–2 concentric circles or rounded rectangles in primary.
- A small label in the bottom-left ("PLACEHOLDER · TBC Corporate Portal") in mono 11px.

```tsx
<Placeholder accent="indigo" aspect="16/10" label="TBC Corporate Portal" />
```

When real imagery is supplied, swap to `<Image>` with the same aspect, no other changes needed.

### `AvatarPH`
2-letter initials on a brand-color disc. 64px default, 24px (byline), 1/1 aspect. Used until real headshots arrive.

### `HeroBackdrop` (homepage hero only)
Full-bleed absolute layer with:
- A 32×32 grid of 1px lines in `--border` at 10% opacity.
- A radial-gradient glow in primary (35% opacity) centered slightly off-axis.
- 2 floating soft circles (`filter: blur(64px)`, primary at 25% / 15% opacity) that drift on a 12s ease-in-out infinite cycle.

### `FloatingSystemCard` (homepage hero foreground)
A small mock dashboard tile, ~360×220, absolute right-aligned, slight rotation `-3deg`. Contents:
- Mono label "system status"
- Big number "99.97%"
- 3 status rows (auth · payments · ledger) each with a green/amber dot
- `--shadow-purple` halo behind it

---

## Forms

### `Field`
Label (display 600, 12px, tracking 0.04em, secondary) + Input or Textarea + helper text.
- Input: `--surface` bg, 1px `--border`, radius `--radius-md`, padding `12px 14px`, body font 16px.
- Focus: `border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft);`
- Error: border becomes `#D14545` (light) / `#FF8B8B` (dark), helper text matches.
- Required: red asterisk after label.

### `Textarea`
Same as input but `min-height: 140px`, `resize: vertical`.

### `Select` (admin only)
Native `<select>` styled to match input; chevron in `--text-tertiary` 16px.

### `BilingualField` (admin only)
Field with a small EN | KA tab strip at the top-right of the label row. Switches the input value, keeps both in state. Mono font on the tab labels.

### `FileUpload` / `ImageDropzone` (admin only)
- 100% width, dashed 1.5px border `--border-strong`, radius `--radius-lg`.
- Padding `40px`, centered content.
- Icon (cloud-up) 32px, primary color.
- Helper: "Drop a PNG/JPG up to 4MB, or **browse**" (browse is a `LinkUnderline`).
- On hover: border becomes solid primary, bg `--primary-soft`.

### `FormSuccess`
Replaces the form on submit:
- Big check circle in `--primary-soft` background, 80px.
- h3 message ("Got it. We'll be in touch within one business day.")
- Secondary "← Send another message" link.

---

## Navigation patterns

### `Tabs` (used by News categories, Projects filters, Careers departments)
- Inline row of buttons.
- Active: text in primary, 2px primary bottom border.
- Inactive: secondary text, no border.
- 12px gap, padding `12px 4px`, font display 500, 14px.
- Below the tabs, a 1px hairline in `--border`.

### `Pagination`
- "Previous · 1 2 3 ··· 8 · Next"
- Each page number is a 36px square, ghost button. Active: primary fill.

### `Breadcrumb` (admin + detail pages)
- "Projects → TBC Corporate Portal"
- Mono 12px, tertiary text. The arrow "→" is a slim chevron icon in tertiary.

---

## Animations / utilities

### `Reveal` wrapper / `useReveal()` hook
- Adds `.reveal` class.
- Uses `IntersectionObserver` (rootMargin `-10%`) to add `.in` when the element enters view.
- CSS transitions opacity 0→1 and translateY 20px→0 over 700ms.

### `CountUp` / `useCountUp(target, duration, trigger)` hook
- Animates a numeric value from 0 to `target` over `duration` ms when `trigger` becomes true.
- Eased on `t^3` (heavy-easeout). Renders rounded integer on every frame.

### `Marquee`
- Two copies of the children rendered side by side; outer `display: flex`, inner `animation: marquee 40s linear infinite`.
- Mask-image gradient on the outer to fade the edges:
  `mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);`
- Pause on hover.

---

## Admin-specific components

### `AdminShell`
Two-column layout: 240px sidebar + flex content area.
- Sidebar: `--surface` bg, full height, padding 24px.
- Content area: `--bg-deep` bg.

### `AdminSidebar`
- Top: `Logo` + small "ADMIN" pill in mono primary.
- Nav groups (each with a tiny mono label like "CONTENT", "SETTINGS"):
  - **Content**: Dashboard, Projects, News, Team, Partners, Pages
  - **Engagement**: Leads, Job Applications
  - **System**: Users, Settings
- Each item: 12px vertical padding, icon (16px) + label (display 500, 14px).
- Active item: `--primary-soft` background, **3px primary left border** (the brand signature in admin), text primary.
- Bottom: signed-in user pill (avatar + name + role) + sign-out icon.

### `AdminTopbar`
- Page title (h2-like, 24px display 700) at left.
- Right: search input (240px wide), primary action button ("New project +").
- 80px tall, sticky to top of content area, 1px bottom border.

### `AdminTable`
- Inside a `Card` (12px radius, surface bg).
- Header row: mono uppercase 11px, text-tertiary, 1px bottom border.
- Body rows: 60px tall, alternating very-faint stripe (or none — prototype uses none). 1px bottom border between rows.
- Cell padding 16px horizontal.
- Last column: kebab menu (3 dots vertical) for row actions.
- Empty state: centered, an icon + "No projects yet" + "Create one" button.

### `AdminDrawer`
- 640px wide, slides in from right.
- Backdrop: black at 40% opacity.
- Header: title + close (X) icon. 1px bottom border.
- Footer: "Cancel" (ghost) + primary action ("Save changes"). 1px top border, sticky.
- Body scrolls; header + footer stay.

### `StatusPill` (in admin tables)
Same as `Chip` but with a colored dot prefix. See **§1.4 Status colors** in `design-tokens.md` for the four status palettes.

### `Toggle` (admin forms)
- 44×24 pill. Off: `--border` track. On: `--primary` track.
- 20px white knob with `--shadow-sm`.
- Transition 200ms `ease-out`.

### `KV` (key-value pair, admin detail drawers)
Two-column row: `key` in mono tertiary uppercase, `value` in body or mono. 12px vertical padding, 1px bottom border.

---

## Component → file mapping in prototype

| Component | Found in |
|---|---|
| `Logo`, `Navbar`, `LangSwitch`, `ThemeSwitch`, `Footer`, `Placeholder`, `AvatarPH`, `useReveal`, `useCountUp`, `HeroBackdrop` | `components.jsx` |
| `Hero`, `StatsBand`, `ServicesSection`, `FeaturedProjects`, `PartnerMarquee`, `NewsTeaser`, `FinalCTA`, `SectionHeader`, `ProjectCard`, `NewsCard`, `ServiceCell`, `StatCell` | `page-home.jsx` |
| About + News pages | `page-about-news.jsx` |
| Services / Projects / Careers / Contact | `page-services-projects-careers-contact.jsx` |
| `AdminLoginPage`, `AdminShell`, `AdminTopbar`, `AdminDashboard`, `LeadStatus`, `AdminProjects`, `Toggle`, `ProjectEditModal`, `BilingualField`, `ToggleField`, `AdminLeads`, `LeadDetail`, `KV` | `page-admin.jsx` |
| Tweaks panel (design-only, not for production) | `tweaks-panel.jsx` |
