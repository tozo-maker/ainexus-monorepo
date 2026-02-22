# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** AI Nexus
**Updated:** 2026-02-20 (Light Premium Pivot)
**Category:** AI Intelligence Hub / Directory

---

## Global Rules (Neo-Minimalist Light)

### Color Palette (High Readability)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0F172A` | `--color-foreground` |
| Secondary | `#64748B` | `--muted` |
| CTA/Accent | `#4F46E5` | `--accent` |
| Surface 1 | `#FFFFFF` | `--background` |
| Surface 2 | `#F8FAFC` | `--primary` |
| Borders | `#E2E8F0` | `--border` |

**Color Notes:** High contrast slate for readability, indigo for primary calls to action, and pure white for breathing room.

### Typography

- **Primary Font:** Inter (Display, Heading, Body)
- **Technical Font:** JetBrains Mono
- **Mood:** Clean, intuitive, frictionless, professional.
- **Google Fonts:** [Inter + JetBrains Mono](https://fonts.google.com/share?selection.family=Inter:wght@300;400;500;600;700|JetBrains+Mono:wght@400;500;600;700)

### Interaction & Depth (The "Clean Tech" feel)

- **Hover Physics:** Use `cubic-bezier(0.16, 1, 0.3, 1)` for a smooth transition without bouncing.
- **Z-Axis Depth:** Hovered elements lift slightly and cast a crisp shadow instead of a soft glow.
- **Micro-interactions:** Keep interactions deliberate. Clutter should be hidden behind tooltips or hover cards.

---

## Component Specs

### Buttons

```css
/* Primary Button (Indigo) */
.btn-primary {
  background: var(--accent);
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 6px -1px var(--accent-glow);
  transition: var(--transition);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px var(--accent-glow);
}
```

### Cards (Crystal Clean)

```css
.card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.card:hover {
  border-color: var(--muted);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

---

## Anti-Patterns (Forbidden in Minimal UI)

- ❌ **Glow Filters** — Do not use colored box shadows (like the old gold glow). Stick to neutral slate shadows.
- ❌ **Data Density** — Do not pack waveforms, social icons, and dense text into grid items. Show Trust, Rating, Name, Tagline.
- ❌ **Dark Surfaces** — All cards and floating elements should be white (`#FFFFFF`) or off-white (`#F8FAFC`).
- ❌ **Emoji Icons** — Use SVG glyphs (Lucide).

---

## Pre-Delivery Checklist

- [ ] Light mode contrast 4.5:1 minimum (`#0F172A` on `#FFFFFF` is preferred)
- [ ] No layout shift on hover
- [ ] Responsive at 375px (Mobile)
- [ ] Inter font loaded and active
