# TechStackBD UI Redesign Plan

**Date:** 2026-09-17  
**Scope:** Visual identity, chrome, landing, and shared component systems while preserving Astro/React architecture and all learning content.

## Current strengths

- Solid information architecture: tracks, careers, projects, interviews, AI hub, My Learning
- Semantic light/dark CSS variables already exist
- Bilingual EN/BN routes and dictionaries
- Accessible patterns started (skip link, focus-visible, reduced-motion)
- Static-first Astro with React islands only where needed
- HD brand masters already present under `public/images/`

## Current weaknesses

- Branding still “Dev Turning Point” / “DT” lettermark; TechStackBD HD assets unused
- Landing is text-heavy without hero carousel or feature narrative
- Header is flat link soup; no mega-menu / IA grouping
- Footer is thin (policy links only)
- Cards/buttons are basic; inconsistent elevation/hover language
- Lucide listed in package.json but unused; no Material Symbols system
- Motion tokens not defined beyond reduced-motion reset
- Track cards lack icons / progress cues
- Search/assessment/graph UIs functional but visually utilitarian

## Proposed design system

| Layer | Direction |
|---|---|
| Color | Deep indigo primary, cyan secondary, teal accent, optional violet for AI; semantic tokens for surfaces/text/status |
| Type | Keep Source Sans 3 + Noto Bengali; Source Serif 4 / Noto Serif Bengali for display; IBM Plex Mono for code |
| Icons | Material Symbols Rounded via shared `<MaterialIcon>` |
| Motion | `--duration-fast/normal/slow` + standard/emphasized easing; respect `prefers-reduced-motion` |
| Surfaces | Shared `.surface-card`, feature/track/project card variants |
| Brand assets | Use numbered HD PNGs in `public/images/`; transparent logos for light/dark |

## Brand asset mapping

| Asset | Path | Use |
|---|---|---|
| Icon | `01a_techstackbd_transparent_logo.png` | Favicon-adjacent, compact header, mobile |
| Wordmark | `01b_techstackbd_transparent_logo_with_text.png` | Desktop header, footer |
| Loading | `02_techstackbd_loading_logo.gif` | Meaningful async only |
| Heroes 1–5 | `04_`…`08_` | Home carousel |
| Features 1–6 | `09_`…`14_` | Landing editorial sections |

## Animation strategy

- 120–180ms: button/icon microinteractions
- 200–300ms: cards, drawers, answer expand
- 300–500ms: carousel / larger panels
- Autoplay carousel ~7s; pause on hover/focus/hidden tab; off under reduced motion

## Accessibility strategy

- Visible focus, landmarks, Escape+focus trap for mobile sheet
- Decorative hero/feature `alt=""` when adjacent text exists
- Carousel previous/next + indicators + keyboard
- Bangla line-height and menu width verification

## Responsive strategy

- Mobile: stacked hero text→image; drawer nav with icon logo
- Desktop: sticky translucent header; mega-menu for Learn
- Images: `sizes` + `loading="lazy"` below fold; width/height reserved

## Implementation phases (executed)

1. Tokens / typography / motion / site config / navigation data  
2. Material icons + BrandLogo  
3. Header / mobile drawer / footer  
4. Hero carousel + landing narrative + feature sections  
5. Track cards + key surface polish (AI, 404, tracks)  
6. Tests + build QA  

## Risk notes

- Do not invent social/contact URLs; use `src/config/site.ts` only for real values  
- Do not rewrite educational MDX for aesthetics  
- Prefer CSS motion over heavy JS libraries  
- WebP/AVIF conversion deferred if tooling unavailable; use responsive `sizes` on PNG masters
