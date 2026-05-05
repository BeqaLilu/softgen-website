# Softgen.ge — Developer Handoff

This folder is everything an engineer (or build agent like Claude Code / Cursor) needs to build the Softgen.ge website from the design prototype. **Read in this order:**

| # | File | What it is |
|---|---|---|
| 1 | **`prototype.html`** | Self-contained, offline copy of the full clickable prototype. Open it in any browser. **The visual source of truth — when in doubt, look here.** |
| 2 | **`build-prompt.md`** | The prompt to paste into your build agent. Sets stack, rules, and build order. Start here. |
| 3 | **`design-tokens.md`** | Exact color, type, spacing, radii, shadow, motion values. Drop straight into `tailwind.config.ts` + `globals.css`. |
| 4 | **`components.md`** | Every reusable component — anatomy, props, behavior. |
| 5 | **`pages.md`** | Page-by-page section spec, data sources, form behaviors, **database schema**. |
| 6 | **`copywriting.md`** | Every visible string in EN + KA. Use as DB seed. |

## Stack (locked)

Next.js 14+ App Router · TypeScript strict · Tailwind · Postgres + Drizzle · next-intl · next-auth · TipTap · Resend · Vercel Blob

## Locked decisions (from design phase)

- **Primary color:** `#4F3EDB`
- **Default theme:** Dark (light is a toggle)
- **Locales:** `en` (default), `ka`
- **Type:** Plus Jakarta Sans (display) + Inter (body) + JetBrains Mono (numerics)
- **Scope:** Desktop-first. Mobile is a separate engagement.

## How the docs fit together

```
              prototype.html  ← visual truth
                    │
                    ▼
              build-prompt.md ← read first
                /  |  |  \
               ▼   ▼  ▼   ▼
       tokens  components  pages  copy
```

`build-prompt.md` references all other files by name. Every spec doc cites the prototype as the tiebreaker if anything disagrees.

## What's NOT in this package

- Real customer photography or screenshots (use `Placeholder` components until provided).
- Mobile breakpoints (separate scope).
- The Tweaks panel from the prototype — that's a designer-only tool, do not port it.
- Logo files for the 18 partners — to be supplied by the client.

## Questions during build

If something is genuinely unclear after reading all five docs and clicking through `prototype.html`, ask the design owner. **Do not improvise visuals.**
