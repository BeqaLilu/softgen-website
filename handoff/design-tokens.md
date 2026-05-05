# Softgen — Design Tokens

> Paste these into `tailwind.config.ts` and `app/globals.css`. The site is **dark-mode primary**; all values below ship with both light and dark variants.

---

## 1. Color

### 1.1 Brand purple (the only brand color)

| Token | Hex | Notes |
|---|---|---|
| `purple-50`  | `#F5F2FF` | tints, hover backgrounds (light mode only) |
| `purple-100` | `#EDE9FF` | chip/pill background (light mode only) |
| `purple-200` | `#DBD3FF` | |
| `purple-300` | `#BDB0FF` | dark-mode link hover |
| `purple-400` | `#8E78F0` | dark-mode body accent (links, eyebrows, chip text) |
| `purple-500` | `#4F3EDB` | **`primary`** — buttons, focus rings, eyebrow (light), CTA fill |
| `purple-600` | `#4232C2` | |
| `purple-700` | `#362AA0` | **`primary-deep`** — primary button hover |
| `purple-800` | `#2A2080` | |
| `purple-900` | `#1F1860` | dark-mode CTA gradient end |

### 1.2 Semantic — light mode

```
--bg:              #FFFFFF
--bg-soft:         #FAF8FC
--bg-deep:         #F2EFF6      /* admin chrome bg, page-section deep */
--surface:         #FFFFFF      /* cards, drawers */
--surface-elev:    #FFFFFF
--border:          #E6E2EF
--border-strong:   #C4BED6
--text-primary:    #0E0B1A      /* ink-900 */
--text-secondary:  #4A436A      /* ink-600 */
--text-tertiary:   #6B638A      /* ink-500 */
--text-on-purple:  #FFFFFF
--primary-soft:    #EDE9FF      /* same as purple-100 */
```

### 1.3 Semantic — dark mode (DEFAULT)

```
--bg:              #0B0815
--bg-soft:         #110D1F
--bg-deep:         #06040E
--surface:         #15112A
--surface-elev:    #1B1734
--border:          #2A2447
--border-strong:   #3D3560
--text-primary:    #F5F2FF
--text-secondary:  #B6AED4
--text-tertiary:   #8A82A8
--primary-soft:    rgba(143, 122, 255, 0.18)   /* hsla equivalent — low-alpha tint of primary */
```

> **Important:** `--primary-soft` is theme-aware. In light mode it's `purple-100` (a flat pale tint); in dark mode it's a low-alpha tint of the primary so it overlays correctly on `--bg`. If you compute `--primary-soft` from a runtime user-picked primary, branch on theme — see `app.jsx::applyPrimary` in the prototype.

### 1.4 Status colors (used in admin chips)

| Status | Foreground | Background |
|---|---|---|
| Default / "New" | `var(--primary)` | `var(--primary-soft)` |
| Contacted | `#3F7DC9` (light) / `#7AB0FF` (dark) | `rgba(63, 125, 201, 0.15)` |
| Qualified | `#2E8467` (light) / `#7BD8A9` (dark) | `rgba(46, 132, 103, 0.15)` |
| Lost | `#8A82A8` (the tertiary text) | `rgba(138, 130, 168, 0.15)` |

### 1.5 Selection + scrollbar

```
::selection { background: var(--primary); color: white; }
scrollbar-thumb: var(--border-strong)
```

---

## 2. Typography

### 2.1 Font families (load all three)

```
--font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, sans-serif
--font-body:    "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif
--font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace
```

Load weights: **Plus Jakarta Sans 500/600/700**, **Inter 400/500/600**, **JetBrains Mono 400/500**. Latin + Georgian subsets required.

`body` uses Inter; **all headings, eyebrows, buttons, chips and stat numbers use Plus Jakarta Sans.** Numerics in admin tables and stat suffixes use JetBrains Mono.

### 2.2 Type scale

| Class | Size | Line height | Letter spacing | Weight | Use |
|---|---|---|---|---|---|
| `.h-display` | `clamp(48px, 6.5vw, 88px)` | 1.02 | -0.035em | 700 | Hero headlines |
| `.h1` | `clamp(40px, 5vw, 64px)` | 1.05 | -0.03em | 700 | Page titles, CTA band |
| `.h2` | `clamp(32px, 3.6vw, 48px)` | 1.08 | -0.025em | 700 | Section headers |
| `.h3` | `clamp(22px, 2vw, 28px)` | 1.2 | -0.02em | 700 | Card titles, subheads |
| `.h4` | `18px` | 1.3 | -0.01em | 700 | Smallest heading |
| `.lead` | `clamp(17px, 1.4vw, 20px)` | 1.55 | — | 400 | Sub-headlines, intros |
| body | `16px` | 1.5 | — | 400 | Default paragraph |
| `.eyebrow` | `12px` | — | 0.12em (uppercase) | 600 | Always preceded by a 24×1px rule |
| `.chip` | `12px` | — | 0.02em | 600 | Pills, status, tags |
| button | `15px` (lg: 16px, sm: 13px) | — | -0.01em | 600 | All button labels |

`text-wrap: pretty` is on `.lead` and `<p>`s in long-form bodies.

### 2.3 Body font-feature-settings

```css
body { font-feature-settings: "ss01", "cv11"; }
```

Inter stylistic alternates. Keep them on.

---

## 3. Spacing & layout

```
--max-w: 1280px       /* container max width */
--gutter: 32px        /* container side padding */
.section: padding: 120px 0
.section-tight: padding: 80px 0
```

**Spacing scale** (use Tailwind defaults, but biased to multiples of 4 with these notable steps for this design):

| Use | Value |
|---|---|
| Form field padding | `12px 14px` |
| Button (default / lg / sm) | `12px 20px` / `16px 28px` / `8px 14px` |
| Card padding | typically `28px` (stat cells), `32px` (project cards), `40px` (large editorial cards) |
| Stack gap inside section header | `12px` between eyebrow → title, `20px` title → lead |
| Grid gap between cards | `24px` (3-up) to `32px` (large featured grid) |

---

## 4. Radii

```
--radius-sm:   6px      /* tags, small chips */
--radius-md:   8px      /* buttons, inputs */
--radius-lg:   12px     /* cards */
--radius-xl:   20px     /* large feature cards */
--radius-2xl:  28px     /* hero composition, CTA band */
--radius-full: 999px    /* pills, avatars, lang switch */
```

---

## 5. Shadows

### Light mode

```
--shadow-xs:     0 1px 2px rgba(15, 12, 30, 0.05)
--shadow-sm:     0 2px 6px rgba(15, 12, 30, 0.06), 0 1px 2px rgba(15, 12, 30, 0.04)
--shadow-md:     0 8px 24px rgba(15, 12, 30, 0.08), 0 2px 6px rgba(15, 12, 30, 0.04)
--shadow-lg:     0 24px 60px rgba(15, 12, 30, 0.12), 0 8px 16px rgba(15, 12, 30, 0.06)
--shadow-purple: 0 16px 40px rgba(79, 62, 219, 0.25)
```

### Dark mode

```
--shadow-xs:     0 1px 2px rgba(0, 0, 0, 0.4)
--shadow-sm:     0 2px 6px rgba(0, 0, 0, 0.5)
--shadow-md:     0 8px 24px rgba(0, 0, 0, 0.4)
--shadow-lg:     0 24px 60px rgba(0, 0, 0, 0.5)
--shadow-purple: 0 16px 40px rgba(79, 62, 219, 0.45)
```

`--shadow-purple` is for primary buttons on hover and the floating system-health card on the hero.

---

## 6. Motion

```
--ease-out:     cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1)
```

| Use | Duration | Easing |
|---|---|---|
| Button / link hover | `150ms` | `ease-out` |
| Card hover (border, transform) | `200ms` | `ease-out` |
| Theme toggle (bg + color) | `400ms` | `ease-out` |
| Page enter (`pageEnter` keyframe) | `450ms` | `ease-out` (translateY 12px → 0, opacity) |
| Scroll-reveal (`.reveal.in`) | `700ms` | `ease-out` (translateY 20px → 0, opacity) |
| Stagger children (`stagIn` keyframe) | `600ms` | `ease-out`, 50–80ms delay step |
| Stat counter | `1500ms` (custom, easeOut on `t^3`) | — |
| Marquee | linear, ~40s for one full loop | — |

**Reduced motion:** wrap scroll-reveal and the marquee in `@media (prefers-reduced-motion: no-preference)`. Page-enter and counter should still run (they're brief and quiet).

---

## 7. Focus states

All interactive elements:

```css
:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-soft);
}
```

Inputs already implement this. Buttons should match — add the same focus ring.

---

## 8. Tailwind config snippet

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        purple: {
          50:  "#F5F2FF", 100: "#EDE9FF", 200: "#DBD3FF",
          300: "#BDB0FF", 400: "#8E78F0", 500: "#4F3EDB",
          600: "#4232C2", 700: "#362AA0", 800: "#2A2080", 900: "#1F1860",
        },
        ink: {
          50:  "#FAF8FC", 100: "#F2EFF6", 200: "#E6E2EF",
          300: "#C4BED6", 400: "#948CB0", 500: "#6B638A",
          600: "#4A436A", 700: "#322B4D", 800: "#1B1730", 900: "#0E0B1A",
        },
        // semantic — wired to CSS vars in globals.css
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        "bg-deep": "var(--bg-deep)",
        surface: "var(--surface)",
        "surface-elev": "var(--surface-elev)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        primary: "var(--primary)",
        "primary-soft": "var(--primary-soft)",
        "primary-deep": "var(--primary-deep)",
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        body:    ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "6px", md: "8px", lg: "12px", xl: "20px", "2xl": "28px",
      },
      boxShadow: {
        xs:     "var(--shadow-xs)",
        sm:     "var(--shadow-sm)",
        md:     "var(--shadow-md)",
        lg:     "var(--shadow-lg)",
        purple: "var(--shadow-purple)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-quint": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      maxWidth: { container: "1280px" },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 9. Source of truth

The prototype's `styles.css` is canonical. If a number here disagrees with `styles.css`, **the CSS file wins** — copy it.
