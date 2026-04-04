# Site Revamp Design Spec

**Date:** 2026-04-03
**Branch:** `acting-coding-synergy`
**Domain:** luismeraz.com

## Goal

Revamp luismeraz.com from a single-page actor portfolio into a multi-page personal site that:

1. Hosts a technical blog with strong SEO (primary content engine)
2. Captures email subscribers via Buttondown (pre-launch list for Apple MCP Bridge)
3. Establishes Luis as a credible voice in the MCP / local-first / Apple developer ecosystem
4. Preserves the acting portfolio as a first-class section (unified identity)

---

## Decisions Summary

| Decision | Choice |
|---|---|
| SSG | Astro |
| Email provider | Buttondown (plain HTML form, no JS) |
| Identity | Unified — acting + building on one site |
| Nav order | About · Blog · Acting · Apple MCP Bridge |
| Design direction | Warm Editorial (evolves current palette) |
| Dark mode | System preference (`prefers-color-scheme`) with manual toggle |
| Homepage layout | Split Hero (text left, headshot right, posts below) |
| Blog reading width | Medium (~80ch) |
| Blog post endings | Email signup CTA + author card |
| Acting page | Full portfolio migration |
| Product page | Landing page with waitlist (no public repo yet) |

---

## 1. Project Structure & Routing

```
src/
├── layouts/
│   ├── BaseLayout.astro        # HTML shell, meta tags, nav, footer, dark mode
│   ├── BlogPost.astro          # Extends Base — reading width, author card, signup CTA
│   └── Page.astro              # Extends Base — generic page wrapper
├── pages/
│   ├── index.astro             # Homepage (Split Hero + latest posts)
│   ├── about.astro             # About page
│   ├── acting.astro            # Acting portfolio
│   ├── apple-mcp-bridge.astro  # Product landing page
│   ├── blog/
│   │   ├── index.astro         # Blog listing with tag/category filters
│   │   └── [slug].astro        # Dynamic blog post pages
│   ├── tags/
│   │   └── [tag].astro         # Posts filtered by tag
│   ├── newsletter.astro        # Dedicated signup page
│   ├── rss.xml.ts              # RSS feed generation
│   └── 404.astro               # Custom 404
├── content/
│   └── blog/                   # Markdown blog posts
│       └── config.ts           # Content Collection schema
├── components/
│   ├── Nav.astro               # Site navigation + dark mode toggle
│   ├── Footer.astro            # Footer with social links + signup
│   ├── PostCard.astro          # Blog post preview card
│   ├── TagList.astro           # Tag pills
│   ├── AuthorCard.astro        # End-of-post author bio card
│   ├── SignupForm.astro        # Buttondown email form
│   ├── ReelCard.astro          # Vimeo reel with click-to-play
│   ├── Gallery.astro           # Photo gallery grid
│   ├── ThemeToggle.astro       # Dark/light mode switch
│   └── SEO.astro               # Meta tags, OG, JSON-LD, canonical
├── styles/
│   └── global.css              # CSS variables, tokens, base styles
└── assets/                     # Images processed by Astro
public/
├── files/
│   └── luis-meraz-actor-resume.pdf
├── images/                     # Static images (headshots, photos, meta)
├── robots.txt
└── site.webmanifest
astro.config.mjs                # Astro config with sitemap, RSS, GitHub Pages
```

**Routing:**

- Blog posts: `/blog/{slug}`
- Tag pages: `/tags/{tag}`
- RSS feed: `/rss.xml`
- Acting: `/acting`
- Product: `/apple-mcp-bridge`

---

## 2. Blog Post Frontmatter & Content Collection Schema

### Frontmatter format

```markdown
---
title: "Why Can't AI Agents Access Your Apple Data?"
description: "Apple's personal data has no OAuth, no REST API. Here's why local-first MCP is the only answer."
pubDate: 2026-03-28
updatedDate: 2026-03-29          # optional — shows "Updated" badge
tags: ["mcp", "apple", "local-first"]
category: "Apple Integration"     # one of five content pillars
readingTime: 8                    # optional — auto-calculated if omitted
ogImage: "./og-apple-data.png"    # optional — falls back to site default
canonicalUrl: "https://dev.to/..." # optional — for cross-posted articles
draft: false                      # true = hidden from production builds
---
```

### Schema enforcement (`config.ts`)

- **Required:** `title`, `description`, `pubDate`, `tags` (min 1), `category`
- **Optional:** `updatedDate`, `readingTime`, `ogImage`, `canonicalUrl`, `draft`
- **Category enum:** `"Apple Integration"` | `"Performance"` | `"MCP Ecosystem"` | `"Build Log"` | `"Philosophy"`
- **Tags:** Freeform strings. Initial set: `mcp`, `apple`, `local-first`, `performance`, `duckdb`, `architecture`, `build-in-public`, `macos`, `privacy`

### Reading time

Auto-calculated at build time (~200 words/minute). Manual `readingTime` override available for code-heavy posts where word count inflates read time.

---

## 3. SEO & Meta Infrastructure

### `SEO.astro` component

Generates all meta tags from page props. Included in `BaseLayout.astro`.

**Standard meta (every page):**

- `<title>`: `{pageTitle} | Luis Meraz` (homepage: just "Luis Meraz")
- `<meta name="description">`: Unique per page; from frontmatter for posts
- `<link rel="canonical">`: Self-referencing by default, overridden by `canonicalUrl`

**Open Graph + Twitter (every page):**

- `og:title`, `og:description`, `og:image`, `og:url`
- `og:type`: `article` for posts, `website` for pages
- `twitter:card`: `summary_large_image`
- `twitter:site`: `@itsluismeraz`
- Blog posts add: `og:article:published_time`, `og:article:tag`

**JSON-LD structured data:**

- Every page: `WebSite` + `Person` schema
- Blog posts: `Article` schema (author, datePublished, dateModified, description, image)
- Product page: `SoftwareApplication` schema
- Acting page: `ProfilePage` + `Person` with acting context

**Generated files:**

- `sitemap.xml`: Auto-generated by `@astrojs/sitemap`
- `robots.txt`: Allows all crawlers, references sitemap
- `rss.xml`: Full-content feed via `@astrojs/rss`, auto-discoverable via `<link rel="alternate">` in `<head>`

**Default meta descriptions by page:**

- Homepage: "Luis Meraz — actor and builder. Writing about MCP, local-first architecture, and Apple data integration."
- Product: "Apple MCP Bridge — connect Apple Calendar, Contacts, Notes, and Reminders to any AI agent. Local-first, privacy by architecture."
- Blog listing: "Technical blog on MCP connectors, Apple integration, local-first architecture, and building indie software."
- Acting: "Luis Meraz is a bilingual Mexican American actor in Los Angeles who acts, improvises, clowns, writes, and produces."

---

## 4. Pages In Detail

### Homepage (`/`)

- **Nav bar:** "Luis Meraz" (italic serif) left, links right (About · Blog · Acting · Apple MCP Bridge), dark mode toggle at far right
- **Split Hero:** Left: label ("Actor & Builder"), one-line intro, description mentioning Apple MCP Bridge, two CTAs ("Subscribe" primary, "Read the blog" secondary). Right: theatrical headshot. On mobile: headshot stacks above text.
- **Latest Posts:** Section labeled "Writing" — 3-5 most recent posts showing title, date, reading time, tags, one-line excerpt
- **Footer:** Buttondown signup form inline, social links (IMDb, Instagram, TikTok, GitHub), copyright

### About (`/about`)

- First-person narrative bridging both identities: acting background, Meta/Lyft, Do Tell productions, then the pivot to Apple MCP Bridge, indie ethos, motivations
- Casual photo (not theatrical headshot)
- Links to: acting page, product page, blog

### Blog Listing (`/blog`)

- Post list: title (italic serif), date, reading time, category pill, tags, one-line description
- Filter bar: client-side JS filter by category (five pillars) and/or tag. No page reload — filters the visible list in place.
- Pagination at ~15 posts: static `/blog/2`, `/blog/3`, etc.

### Blog Post (`/blog/[slug]`)

- Header: title (large italic serif), date, reading time, category, tags
- Body: ~80ch centered column, Shiki syntax highlighting, responsive images
- End of post: Buttondown signup CTA ("I write about MCP and Apple integration ~weekly"), then AuthorCard (photo, name, one-line bio, links to About and Twitter/X)

### Acting (`/acting`)

Full migration of current site content into the Warm Editorial design system:

- Hero: theatrical headshot (full-width with vignette gradient)
- About blurb (the current acting-focused bio)
- Reels: comedy + drama Vimeo embeds in 2-column grid with click-to-play (preserving current lazy-embed pattern)
- Photo gallery: 6 photos in 3-column grid (2-column on tablet, 1-column on mobile)
- Resume: PDF embed + download link
- Contact: email + social handle

Shares nav/footer with all pages — feels integrated, not separate.

### Apple MCP Bridge (`/apple-mcp-bridge`)

- **Problem statement:** "Apple's personal data has no API. AI agents can't reach it."
- **What it does:** Brief explanation, mental model ("Spotlight for AI agents")
- **How it works:** Visual flow — data sources (Calendar, Contacts, Notes, Reminders) → local index (DuckDB) → MCP tools → any AI client
- **Performance claim:** "2-4ms local queries vs 50-300ms cloud round-trips"
- **Current status:** "Phase 1: Apple data integration. Currently in prototype."
- **Waitlist signup:** Prominent Buttondown form — "Get notified when it ships"
- **Roadmap:** Static list of phases:
  1. Phase 1 (current): Apple data — Calendar, Contacts, Reminders, Notes
  2. Phase 2: Google (OAuth localhost flow)
  3. Phase 3: Microsoft 365
  4. Phase 4: Local files — Documents, Downloads, Desktop with full-text search
  5. Phase 5: Browser history and bookmarks

**Future additions when GitHub repo goes public:**

- GitHub repo link with live stars badge
- Link to public issue tracker for community roadmap
- Contributor information / how to contribute
- README preview or architecture diagram embed

### Newsletter (`/newsletter`)

- Brief pitch: what Luis writes about, cadence (~weekly), no spam promise
- Buttondown signup form
- Sample of recent post titles as social proof

### 404 Page

- On-brand message, light tone
- Links to homepage and blog

---

## 5. Visual Design System

### Typography

| Role | Font | Weights | Usage |
|---|---|---|---|
| Display/headings | Instrument Serif | 400 italic | Post titles, page titles, hero text |
| UI/labels | Syne | 400, 600, 700 | Nav, labels, tags, buttons, metadata |
| Body | Source Serif 4 | 300, 400 | Blog content, prose, descriptions |
| Code | System monospace | — | `ui-monospace, 'SF Mono', Menlo, monospace` |

### Color Tokens

**Light mode:**

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#faf6f1` | Page background |
| `--bg-warm` | `#f2ebe2` | Alternate sections |
| `--bg-surface` | `#ede5da` | Cards, code block backgrounds |
| `--text` | `#1e1b18` | Primary text |
| `--text-muted` | `#6b6259` | Dates, metadata, secondary |
| `--accent` | `#c7623d` | Links, CTAs, active states |
| `--accent-hover` | `#a94f2e` | Hover states |
| `--accent-soft` | `#e8926e` | Decorative accents |
| `--border` | `rgba(30,27,24,0.12)` | Dividers, card edges |

**Dark mode (warm darks, not pure black):**

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#1a1714` | Page background |
| `--bg-warm` | `#211e1a` | Alternate sections |
| `--bg-surface` | `#2a2520` | Cards, code block backgrounds |
| `--text` | `#e8e0d6` | Primary text |
| `--text-muted` | `#9a8e82` | Dates, metadata, secondary |
| `--accent` | `#e8926e` | Links, CTAs (softened for dark bg) |
| `--accent-hover` | `#f0a580` | Hover states |
| `--border` | `rgba(232,224,214,0.1)` | Dividers, card edges |

### Spacing & Layout

- Max content width: `72rem` via `min(90%, 72rem)`
- Blog reading column: `80ch` centered
- Section padding: `clamp(2.5rem, 6vh, 4.5rem)` vertical
- Component gap: `1.25rem` standard, `2rem` between major sections

### Animations

- **Scroll reveal:** `IntersectionObserver` — fade up on enter, observe once. Threshold 0.15, root margin `0px 0px -40px 0px`.
- **Page transitions:** None (static, keep fast)
- **Hover states:** Scale 1.015 on images/cards, underline slide on links, 0.3s color transitions
- **Hero:** Staggered reveal on load via `animation-delay` (0.2s, 0.4s, 0.6s)
- **Dark mode toggle:** 0.2s transition on `background-color` and `color`

### Code Blocks

- Shiki with `github-light` (light mode) / `github-dark` (dark mode)
- Background: `--bg-surface`
- Rounded corners (4px), subtle left-border accent in `--accent`
- Language label top-right
- Copy button on hover

### Grain Overlay

Preserved from current site: fixed position, `opacity: 0.04`, `pointer-events: none`, 48px tiled noise PNG. Adds warmth and tactile quality.

---

## 6. Integrations & Deployment

### Buttondown Email Capture

Plain HTML `<form>` POST to Buttondown endpoint. No JavaScript required. Four placements:

1. **Homepage hero** — primary CTA button
2. **End of blog posts** — inline form ("I write about MCP and Apple integration ~weekly")
3. **Site footer** — compact single-line form
4. **Dedicated `/newsletter` page** — full pitch + form

Product page uses the same form with different copy and Buttondown tag to segment waitlist vs newsletter subscribers.

### RSS Feed

- Full-content feed at `/rss.xml` via `@astrojs/rss`
- Includes: title, description, pubDate, author, tags, full post HTML
- Auto-discoverable via `<link rel="alternate" type="application/rss+xml">` in `<head>`

### GitHub Pages Deployment

- GitHub Actions workflow: on push to `main` → build Astro → deploy to Pages
- `astro.config.mjs`: `site: 'https://luismeraz.com'`, `output: 'static'`
- CNAME preserved in `public/` for custom domain
- `@astrojs/sitemap` generates `sitemap.xml` at build

### Dark Mode Implementation

- Blocking `<script>` in `<head>` (prevents flash of light theme):
  1. Check `localStorage` for saved preference
  2. Fall back to `prefers-color-scheme` media query
  3. Set `data-theme` attribute on `<html>`
- Toggle component writes to `localStorage` and swaps attribute
- All tokens switch via `html[data-theme="dark"] { ... }`
- 0.2s CSS transition on color properties

### Astro Integrations

| Package | Purpose |
|---|---|
| `@astrojs/sitemap` | Auto-generated sitemap.xml |
| `@astrojs/rss` | RSS feed generation |
| `@astrojs/mdx` | MDX support (optional, add later if needed) |
| `shiki` | Built into Astro — syntax highlighting |

### Cross-Posting Support

- `canonicalUrl` frontmatter field for dev.to cross-posts
- OG images in frontmatter for social card previews
- Descriptions always populated for social sharing

---

## Migration Notes

### Assets to preserve from current site

- All images in `images/` (headshots, photos, meta, optimized)
- `files/luis-meraz-actor-resume.pdf`
- `site.webmanifest` (update `background_color`/`theme_color` if needed)
- Favicon files in `images/meta/`
- CNAME file

### Content to migrate

- Acting bio text from current `index.html` About section
- Vimeo reel data (IDs, hashes, titles) from current HTML
- Photo gallery image references
- Social links (IMDb, Instagram, TikTok)
- Contact info (email, social handle)
- Structured data (Person schema — extend, don't replace)

### What changes

- Single `index.html` → Astro multi-page architecture
- Inline CSS → `global.css` + scoped Astro component styles
- Inline JS → component scripts + dark mode head script
- No build step → Astro build pipeline with GitHub Actions
