# Site Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp luismeraz.com from a single-page actor portfolio into a multi-page Astro site with blog, acting portfolio, Apple MCP Bridge product page, and Buttondown email capture.

**Architecture:** Astro static site with Content Collections (glob loader + Zod schema) for blog posts, file-based routing for pages, CSS custom properties for theming (light/dark), and plain HTML Buttondown forms for email capture. Deployed to GitHub Pages via GitHub Actions.

**Tech Stack:** Astro 5.x, @astrojs/rss, @astrojs/sitemap, Shiki (built-in), Buttondown, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-04-03-site-revamp-design.md`

**Working directory:** `.worktrees/acting-coding-synergy`

---

## File Map

### New files (Astro project)

| File | Responsibility |
|---|---|
| `package.json` | Project dependencies and scripts |
| `astro.config.mjs` | Astro config: site URL, integrations, Shiki themes |
| `tsconfig.json` | TypeScript config for Astro |
| `src/content.config.ts` | Content Collection schema (blog posts) |
| `src/styles/global.css` | CSS tokens, reset, typography, dark mode, grain, animations |
| `src/layouts/BaseLayout.astro` | HTML shell, head, nav, footer, dark mode script |
| `src/layouts/BlogPost.astro` | Blog post wrapper: header, 80ch body, author card, signup |
| `src/components/Nav.astro` | Navigation bar + dark mode toggle |
| `src/components/Footer.astro` | Footer: signup form, social links, copyright |
| `src/components/SEO.astro` | Meta tags, OG, Twitter, JSON-LD |
| `src/components/ThemeToggle.astro` | Dark/light mode toggle button |
| `src/components/SignupForm.astro` | Buttondown email form (configurable copy) |
| `src/components/PostCard.astro` | Blog post preview card |
| `src/components/TagList.astro` | Tag pill list |
| `src/components/AuthorCard.astro` | End-of-post author bio |
| `src/components/ReelCard.astro` | Vimeo reel with click-to-play |
| `src/components/Gallery.astro` | Photo gallery grid |
| `src/pages/index.astro` | Homepage: split hero + latest posts |
| `src/pages/about.astro` | About page |
| `src/pages/acting.astro` | Acting portfolio |
| `src/pages/apple-mcp-bridge.astro` | Product landing page |
| `src/pages/blog/index.astro` | Blog listing with client-side filters |
| `src/pages/blog/[slug].astro` | Blog post dynamic route |
| `src/pages/tags/[tag].astro` | Tag filter page |
| `src/pages/newsletter.astro` | Dedicated signup page |
| `src/pages/rss.xml.ts` | RSS feed |
| `src/pages/404.astro` | Custom 404 |
| `src/blog/first-post.md` | Sample blog post for testing |
| `.github/workflows/deploy.yml` | GitHub Actions deploy workflow |

### Migrated from current site

| Source | Destination |
|---|---|
| `images/` | `public/images/` |
| `files/luis-meraz-actor-resume.pdf` | `public/files/luis-meraz-actor-resume.pdf` |
| `images/meta/` (favicons) | `public/images/meta/` |
| `CNAME` | `public/CNAME` |
| `site.webmanifest` | `public/site.webmanifest` |

### Deleted after migration

| File | Reason |
|---|---|
| `index.html` | Replaced by Astro pages |
| `styles.css` | Replaced by `src/styles/global.css` |
| `site.js` | Logic moved into Astro components |

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `public/robots.txt`
- Move: `CNAME` → `public/CNAME`, `site.webmanifest` → `public/site.webmanifest`, `images/` → `public/images/`, `files/` → `public/files/`

- [ ] **Step 1: Initialize Astro project**

Run from `.worktrees/acting-coding-synergy`:

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

If prompted about overwriting, allow it — we'll restore migrated files next.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/rss @astrojs/sitemap
```

- [ ] **Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://luismeraz.com',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
```

- [ ] **Step 4: Move static assets into `public/`**

```bash
# From .worktrees/acting-coding-synergy
mkdir -p public/images public/files
cp -r images/* public/images/
cp -r files/* public/files/
cp CNAME public/CNAME
cp site.webmanifest public/site.webmanifest
```

- [ ] **Step 5: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://luismeraz.com/sitemap-index.xml
```

- [ ] **Step 6: Remove old single-page site files**

```bash
rm index.html styles.css site.js
rm -rf images files
rm CNAME site.webmanifest
```

- [ ] **Step 7: Verify Astro runs**

```bash
npm run dev
```

Expected: Astro dev server starts on localhost:4321 with the default minimal template page.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project and migrate static assets"
```

---

## Task 2: Global CSS — Design Tokens & Base Styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global stylesheet**

Create `src/styles/global.css`:

```css
/* ── Tokens (Light) ────────────────────────────── */
:root {
  --bg: #faf6f1;
  --bg-warm: #f2ebe2;
  --bg-surface: #ede5da;
  --bg-accent: #e8cdb5;
  --text: #1e1b18;
  --text-muted: #6b6259;
  --accent: #c7623d;
  --accent-hover: #a94f2e;
  --accent-soft: #e8926e;
  --border: rgba(30, 27, 24, 0.12);
  --focus-ring: var(--accent);
  --font-display: 'Instrument Serif', serif;
  --font-heading: 'Syne', sans-serif;
  --font-body: 'Source Serif 4', serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --content-width: 72rem;
  --reading-width: 80ch;
}

/* ── Tokens (Dark) ─────────────────────────────── */
html[data-theme="dark"] {
  --bg: #1a1714;
  --bg-warm: #211e1a;
  --bg-surface: #2a2520;
  --bg-accent: #3a2e24;
  --text: #e8e0d6;
  --text-muted: #9a8e82;
  --accent: #e8926e;
  --accent-hover: #f0a580;
  --accent-soft: #c7623d;
  --border: rgba(232, 224, 214, 0.1);
}

/* ── Reset ─────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  min-height: 100%;
  background-color: var(--bg);
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100%;
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text);
  background-color: var(--bg);
  overflow-x: hidden;
  transition: background-color 0.2s ease, color 0.2s ease;
}

main { display: block; }
img, svg { display: block; max-width: 100%; }
[hidden] { display: none !important; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* ── Typography ────────────────────────────────── */
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--text);
}

h1 { font-size: clamp(2.5rem, 5vw, 3.8rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.4rem, 2.5vw, 1.8rem); }

code, pre {
  font-family: var(--font-mono);
}

/* ── Layout ────────────────────────────────────── */
.container {
  width: min(90%, var(--content-width));
  margin: 0 auto;
}

.reading-width {
  max-width: var(--reading-width);
  margin: 0 auto;
}

.section {
  position: relative;
  padding: clamp(2.5rem, 6vh, 4.5rem) 0;
}

/* ── Labels ────────────────────────────────────── */
.label {
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-soft);
}

/* ── Focus ─────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}

/* ── Skip link ─────────────────────────────────── */
.skip-link {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10000;
  padding: 0.75rem 1rem;
  background-color: var(--accent);
  color: #fff;
  font-family: var(--font-heading);
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-200%);
  transition: transform 0.2s ease;
}

.skip-link:focus { transform: translateY(0); }

/* ── Grain overlay ─────────────────────────────── */
.grain {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.04;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMFBQUFBQVMIbLVAAAASElEQVQ4y2MYBaNgGAMWIxgYmBgYGBkYGJkYGFmANAsDIwuQZmFhZGZiYWRmYmJgZmRmYGZgZmBhYGBgYWFiYRgFo2AUAAB2BwJ/cMOjNgAAAABJRU5ErkJggg==");
  background-size: 48px;
}

/* ── Scroll reveal ─────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(1.5rem);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Buttons ───────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fff;
  background-color: var(--accent);
  border: 1.5px solid var(--accent);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover { background-color: var(--accent-hover); }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  background: transparent;
  border: 1.5px solid var(--accent);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--accent);
  color: #fff;
}

/* ── Blog prose ────────────────────────────────── */
.prose p { margin-bottom: 1.5rem; line-height: 1.8; }
.prose h2 { margin-top: 2.5rem; margin-bottom: 1rem; }
.prose h3 { margin-top: 2rem; margin-bottom: 0.75rem; }
.prose ul, .prose ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
.prose li { margin-bottom: 0.5rem; list-style: disc; }
.prose ol li { list-style: decimal; }
.prose a { color: var(--accent); border-bottom: 1px solid transparent; transition: border-color 0.3s ease; }
.prose a:hover { border-bottom-color: var(--accent); }
.prose blockquote {
  border-left: 3px solid var(--accent-soft);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: var(--text-muted);
  font-style: italic;
}
.prose img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1.5rem 0;
}
.prose pre {
  background-color: var(--bg-surface);
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  padding: 1.25rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
}
.prose code:not(pre code) {
  background-color: var(--bg-surface);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.88em;
}

/* ── Tag pills ─────────────────────────────────── */
.tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--text-muted);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.tag:hover {
  color: var(--accent);
  border-color: var(--accent);
}

/* ── Responsive ────────────────────────────────── */
@media (max-width: 768px) {
  .section { padding: clamp(2rem, 4vh, 3rem) 0; }
}

@media (max-width: 480px) {
  .section { padding: 2rem 0; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS with design tokens, dark mode, and base styles"
```

---

## Task 3: SEO Component

**Files:**
- Create: `src/components/SEO.astro`

- [ ] **Step 1: Create SEO component**

Create `src/components/SEO.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
}

const {
  title,
  description,
  canonicalUrl,
  ogImage = '/images/meta/luis-meraz-social-preview.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  noindex = false,
} = Astro.props;

const siteUrl = Astro.site?.toString().replace(/\/$/, '') ?? 'https://luismeraz.com';
const canonical = canonicalUrl ?? new URL(Astro.url.pathname, siteUrl).toString();
const fullTitle = title === 'Luis Meraz' ? title : `${title} | Luis Meraz`;
const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
---

<!-- Standard -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex" />}

<!-- Open Graph -->
<meta property="og:type" content={ogType} />
<meta property="og:site_name" content="Luis Meraz" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:image:alt" content={`${title} — Luis Meraz`} />
{publishedTime && <meta property="article:published_time" content={publishedTime} />}
{modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
{tags.map(tag => <meta property="article:tag" content={tag} />)}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@itsluismeraz" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />
<meta name="twitter:image:alt" content={`${title} — Luis Meraz`} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SEO.astro
git commit -m "feat: add SEO component with OG, Twitter, and canonical support"
```

---

## Task 4: Theme Toggle Component

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create theme toggle**

Create `src/components/ThemeToggle.astro`:

```astro
---
// No props — reads/writes theme from localStorage + system preference
---

<button
  class="theme-toggle"
  id="theme-toggle"
  type="button"
  aria-label="Toggle dark mode"
>
  <svg class="theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
  <svg class="theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.3s ease;
  }
  .theme-toggle:hover { color: var(--accent); }

  /* Light mode: show moon (click to go dark), hide sun */
  .theme-toggle__sun { display: none; }
  .theme-toggle__moon { display: block; }

  /* Dark mode: show sun (click to go light), hide moon */
  html[data-theme="dark"] .theme-toggle__sun { display: block; }
  html[data-theme="dark"] .theme-toggle__moon { display: none; }
</style>

<script>
  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: add dark/light theme toggle component"
```

---

## Task 5: Nav Component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create navigation**

Create `src/components/Nav.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const currentPath = Astro.url.pathname;

const links = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/acting', label: 'Acting' },
  { href: '/apple-mcp-bridge', label: 'Apple MCP Bridge' },
];
---

<header class="site-header">
  <nav class="site-header__inner container" aria-label="Primary">
    <a href="/" class="site-logo">Luis Meraz</a>
    <div class="nav-right">
      <ul class="nav-list">
        {links.map(link => (
          <li>
            <a
              href={link.href}
              class:list={['nav-link', { 'nav-link--active': currentPath.startsWith(link.href) }]}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </div>
  </nav>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 0.75rem 0;
    background-color: var(--bg);
    border-bottom: 1px solid var(--border);
    transition: background-color 0.2s ease;
  }

  .site-header__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .site-logo {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-style: italic;
    color: var(--text);
    text-decoration: none;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-list {
    display: flex;
    gap: 1.75rem;
  }

  .nav-link {
    font-family: var(--font-heading);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.3s ease;
    position: relative;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1.5px;
    background-color: var(--accent);
    transition: width 0.4s var(--ease-out);
  }

  .nav-link:hover,
  .nav-link--active {
    color: var(--text);
  }

  .nav-link:hover::after,
  .nav-link--active::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    .site-header__inner { flex-wrap: wrap; gap: 0.5rem; }
    .nav-list { gap: 1rem; }
    .nav-link { font-size: 0.62rem; letter-spacing: 0.08em; }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component with active states and theme toggle"
```

---

## Task 6: Signup Form Component

**Files:**
- Create: `src/components/SignupForm.astro`

- [ ] **Step 1: Create Buttondown signup form**

Create `src/components/SignupForm.astro`:

```astro
---
interface Props {
  heading?: string;
  description?: string;
  tag?: string;
  compact?: boolean;
}

const {
  heading = 'Stay in the loop',
  description = 'Posts on MCP, Apple integration, and indie software. ~Weekly, no spam.',
  tag,
  compact = false,
} = Astro.props;
---

<div class:list={['signup-form', { 'signup-form--compact': compact }]}>
  {!compact && heading && <p class="signup-form__heading">{heading}</p>}
  {!compact && description && <p class="signup-form__description">{description}</p>}
  <form
    action="https://buttondown.com/api/emails/embed-subscribe/luismeraz"
    method="post"
    target="popupwindow"
    class="signup-form__form"
  >
    {tag && <input type="hidden" name="tag" value={tag} />}
    <input
      type="email"
      name="email"
      placeholder="you@example.com"
      required
      aria-label="Email address"
      class="signup-form__input"
    />
    <button type="submit" class="btn-primary signup-form__button">
      Subscribe
    </button>
  </form>
</div>

<style>
  .signup-form__heading {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-style: italic;
    color: var(--text);
    margin-bottom: 0.25rem;
  }

  .signup-form__description {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .signup-form__form {
    display: flex;
    gap: 0.5rem;
    max-width: 28rem;
  }

  .signup-form--compact .signup-form__form {
    max-width: none;
  }

  .signup-form__input {
    flex: 1;
    padding: 0.7rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text);
    background-color: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    transition: border-color 0.3s ease;
  }

  .signup-form__input::placeholder { color: var(--text-muted); }
  .signup-form__input:focus { border-color: var(--accent); outline: none; }

  .signup-form__button {
    white-space: nowrap;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SignupForm.astro
git commit -m "feat: add Buttondown signup form component"
```

---

## Task 7: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create footer**

Create `src/components/Footer.astro`:

```astro
---
import SignupForm from './SignupForm.astro';

const year = new Date().getFullYear();

const socials = [
  { href: 'https://www.imdb.com/name/nm16037724/', label: 'IMDb', icon: 'imdb' },
  { href: 'https://www.instagram.com/itsluismeraz', label: 'Instagram', icon: 'instagram' },
  { href: 'https://www.tiktok.com/@itsluismeraz', label: 'TikTok', icon: 'tiktok' },
  { href: 'https://github.com/lmeraz', label: 'GitHub', icon: 'github' },
];
---

<footer class="site-footer">
  <div class="footer__inner container">
    <div class="footer__signup">
      <SignupForm compact heading="" description="" />
    </div>
    <div class="footer__bottom">
      <ul class="footer__socials">
        {socials.map(s => (
          <li>
            <a class="footer-social-link" href={s.href} aria-label={`Luis Meraz on ${s.label}`} rel="noopener noreferrer" target="_blank">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p class="footer__copy">&copy; {year} Luis Meraz</p>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--border);
    padding: 2.5rem 0 2rem;
    background-color: var(--bg);
    transition: background-color 0.2s ease;
  }

  .footer__signup { margin-bottom: 2rem; }

  .footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer__socials {
    display: flex;
    gap: 1.25rem;
  }

  .footer-social-link {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.3s ease;
  }

  .footer-social-link:hover { color: var(--accent); }

  .footer__copy {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .footer__bottom {
      flex-direction: column;
      gap: 0.75rem;
      text-align: center;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component with signup form and social links"
```

---

## Task 8: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import SEO from '../components/SEO.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
}

const props = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#faf6f1" />

  {/* Blocking script: prevent dark mode flash */}
  <script is:inline>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  </script>

  <SEO {...props} />

  <link rel="icon" type="image/png" sizes="32x32" href="/images/meta/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/images/meta/favicon-192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/images/meta/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="alternate" type="application/rss+xml" title="Luis Meraz" href="/rss.xml" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap"
    rel="stylesheet"
  />
</head>
<body>
  <div class="grain" aria-hidden="true"></div>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <Nav />

  <main id="main-content">
    <slot />
  </main>

  <Footer />

  <script>
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    for (const el of reveals) observer.observe(el);
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout with dark mode, SEO, nav, footer, scroll reveal"
```

---

## Task 9: Content Collection Schema + Sample Post

**Files:**
- Create: `src/content.config.ts`, `src/blog/first-post.md`

- [ ] **Step 1: Create content collection schema**

Create `src/content.config.ts`:

```typescript
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    category: z.enum([
      'Apple Integration',
      'Performance',
      'MCP Ecosystem',
      'Build Log',
      'Philosophy',
    ]),
    readingTime: z.number().optional(),
    ogImage: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create sample blog post**

Create `src/blog/first-post.md`:

```markdown
---
title: "Why Can't AI Agents Access Your Apple Data?"
description: "Apple's personal data has no OAuth, no REST API. Here's why local-first MCP is the only answer."
pubDate: 2026-04-03
tags: ["mcp", "apple", "local-first"]
category: "Apple Integration"
draft: false
---

Apple's personal data — your calendars, contacts, notes, reminders — lives in a walled garden with no REST API and no OAuth flow. Cloud-hosted MCP connectors can't reach it.

## The Problem

Every major cloud service has OAuth and REST APIs. Apple doesn't. There's no `GET /calendars` endpoint. There's no way for a cloud server to access your iCloud data on your behalf.

This means the 38+ MCP connectors available for cloud services simply can't exist for Apple data.

## Why Local-First Is the Only Answer

If the data can't leave the device via an API, the tool has to come to the data. That's the core insight behind Apple MCP Bridge: a lightweight macOS app that indexes your Apple data locally and exposes it as MCP tools.

```swift
// Local queries complete in 2-4ms
let events = try db.query("SELECT * FROM events WHERE date > ?", [today])
```

Compare that to cloud API round-trips at 50-300ms. Local isn't just more private — it's 50-100x faster.

## What's Next

I'm building this in the open. Follow along as I document the architecture decisions, performance benchmarks, and inevitable wrong turns.
```

- [ ] **Step 3: Verify content collection loads**

```bash
npm run dev
```

Expected: Dev server starts without schema errors.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/blog/first-post.md
git commit -m "feat: add blog content collection schema and sample post"
```

---

## Task 10: PostCard and TagList Components

**Files:**
- Create: `src/components/PostCard.astro`, `src/components/TagList.astro`

- [ ] **Step 1: Create TagList component**

Create `src/components/TagList.astro`:

```astro
---
interface Props {
  tags: string[];
  linked?: boolean;
}

const { tags, linked = true } = Astro.props;
---

<div class="tag-list">
  {tags.map(tag =>
    linked ? (
      <a href={`/tags/${tag}`} class="tag">{tag}</a>
    ) : (
      <span class="tag">{tag}</span>
    )
  )}
</div>

<style>
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
</style>
```

- [ ] **Step 2: Create PostCard component**

Create `src/components/PostCard.astro`:

```astro
---
import TagList from './TagList.astro';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  category: string;
  readingTime?: number;
  slug: string;
}

const { title, description, pubDate, tags, category, readingTime, slug } = Astro.props;

const formattedDate = pubDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

// Auto-calculate reading time if not provided (rough: handled at collection level too)
const displayTime = readingTime ?? '5';
---

<article class="post-card">
  <a href={`/blog/${slug}`} class="post-card__link">
    <h3 class="post-card__title">{title}</h3>
  </a>
  <div class="post-card__meta">
    <time datetime={pubDate.toISOString()}>{formattedDate}</time>
    <span class="post-card__sep">&middot;</span>
    <span>{displayTime} min read</span>
    <span class="post-card__sep">&middot;</span>
    <span class="post-card__category">{category}</span>
  </div>
  <p class="post-card__description">{description}</p>
  <TagList tags={tags} />
</article>

<style>
  .post-card {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--border);
  }

  .post-card__link {
    text-decoration: none;
  }

  .post-card__title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 400;
    font-style: italic;
    color: var(--text);
    margin-bottom: 0.3rem;
    transition: color 0.3s ease;
  }

  .post-card__link:hover .post-card__title {
    color: var(--accent);
  }

  .post-card__meta {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .post-card__sep { opacity: 0.5; }

  .post-card__category {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }

  .post-card__description {
    font-size: 0.92rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TagList.astro src/components/PostCard.astro
git commit -m "feat: add PostCard and TagList components"
```

---

## Task 11: AuthorCard Component

**Files:**
- Create: `src/components/AuthorCard.astro`

- [ ] **Step 1: Create author card**

Create `src/components/AuthorCard.astro`:

```astro
---
// No props — author info is static
---

<aside class="author-card" aria-label="About the author">
  <img
    src="/images/optimized/photos/luis-mouth-480.jpg"
    alt="Luis Meraz"
    class="author-card__photo"
    width="80"
    height="80"
    loading="lazy"
  />
  <div class="author-card__text">
    <p class="author-card__name">Luis Meraz</p>
    <p class="author-card__bio">
      Actor and builder in Los Angeles. Building
      <a href="/apple-mcp-bridge">Apple MCP Bridge</a> — your Apple data, any AI agent.
    </p>
    <div class="author-card__links">
      <a href="/about">About</a>
      <span class="author-card__sep">&middot;</span>
      <a href="https://twitter.com/itsluismeraz" rel="noopener noreferrer">Twitter/X</a>
    </div>
  </div>
</aside>

<style>
  .author-card {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    padding: 1.5rem;
    background-color: var(--bg-warm);
    border-radius: 4px;
    margin-top: 2rem;
  }

  .author-card__photo {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .author-card__name {
    font-family: var(--font-heading);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.2rem;
  }

  .author-card__bio {
    font-size: 0.88rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 0.4rem;
  }

  .author-card__bio a {
    color: var(--accent);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s ease;
  }

  .author-card__bio a:hover { border-bottom-color: var(--accent); }

  .author-card__links {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    gap: 0.4rem;
  }

  .author-card__links a { color: var(--accent); }
  .author-card__sep { opacity: 0.5; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AuthorCard.astro
git commit -m "feat: add AuthorCard component for end-of-post author bio"
```

---

## Task 12: Blog Post Layout

**Files:**
- Create: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Create blog post layout**

Create `src/layouts/BlogPost.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import TagList from '../components/TagList.astro';
import SignupForm from '../components/SignupForm.astro';
import AuthorCard from '../components/AuthorCard.astro';

interface Props {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  category: string;
  readingTime?: number;
  ogImage?: string;
  canonicalUrl?: string;
}

const {
  title,
  description,
  pubDate,
  updatedDate,
  tags,
  category,
  readingTime,
  ogImage,
  canonicalUrl,
} = Astro.props;

const formattedDate = pubDate.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const formattedUpdated = updatedDate?.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const displayTime = readingTime ?? 5;
---

<BaseLayout
  title={title}
  description={description}
  ogType="article"
  ogImage={ogImage}
  canonicalUrl={canonicalUrl}
  publishedTime={pubDate.toISOString()}
  modifiedTime={updatedDate?.toISOString()}
  tags={tags}
>
  <article class="blog-post section">
    <div class="container">
      <div class="reading-width">
        <header class="blog-post__header">
          <div class="blog-post__meta">
            <span class="blog-post__category label">{category}</span>
            <span class="blog-post__sep">&middot;</span>
            <time datetime={pubDate.toISOString()}>{formattedDate}</time>
            <span class="blog-post__sep">&middot;</span>
            <span>{displayTime} min read</span>
          </div>
          <h1 class="blog-post__title">{title}</h1>
          {updatedDate && (
            <p class="blog-post__updated">Updated {formattedUpdated}</p>
          )}
          <TagList tags={tags} />
        </header>

        <div class="prose">
          <slot />
        </div>

        <footer class="blog-post__footer">
          <SignupForm
            heading="Enjoyed this?"
            description="I write about MCP, Apple integration, and indie software ~weekly. No spam."
          />
          <AuthorCard />
        </footer>
      </div>
    </div>
  </article>
</BaseLayout>

<style>
  .blog-post__header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .blog-post__meta {
    font-family: var(--font-heading);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .blog-post__sep { opacity: 0.5; }

  .blog-post__title {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: 0.75rem;
  }

  .blog-post__updated {
    font-family: var(--font-heading);
    font-size: 0.7rem;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .blog-post__footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat: add BlogPost layout with header, prose, signup, and author card"
```

---

## Task 13: Blog Post Dynamic Route

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create blog post page**

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const wordCount = post.body?.split(/\s+/).length ?? 0;
const readingTime = post.data.readingTime ?? Math.ceil(wordCount / 200);
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  updatedDate={post.data.updatedDate}
  tags={post.data.tags}
  category={post.data.category}
  readingTime={readingTime}
  ogImage={post.data.ogImage}
  canonicalUrl={post.data.canonicalUrl}
>
  <Content />
</BlogPost>
```

- [ ] **Step 2: Verify the sample post renders**

```bash
npm run dev
```

Open `http://localhost:4321/blog/first-post` in a browser.

Expected: The sample post renders with title, date, tags, reading time, prose content with syntax highlighting, signup form, and author card.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add dynamic blog post route with auto reading time"
```

---

## Task 14: Blog Listing Page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create blog listing**

Create `src/pages/blog/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const categories = ['All', 'Apple Integration', 'Performance', 'MCP Ecosystem', 'Build Log', 'Philosophy'];
const allTags = [...new Set(posts.flatMap(p => p.data.tags))].sort();
---

<BaseLayout
  title="Blog"
  description="Technical blog on MCP connectors, Apple integration, local-first architecture, and building indie software."
>
  <section class="section">
    <div class="container">
      <h1 class="blog-listing__title">Writing</h1>

      <div class="blog-listing__filters" id="blog-filters">
        <div class="blog-listing__categories">
          {categories.map(cat => (
            <button
              class:list={['filter-btn', { 'filter-btn--active': cat === 'All' }]}
              data-category={cat}
            >
              {cat}
            </button>
          ))}
        </div>
        <div class="blog-listing__tags">
          {allTags.map(tag => (
            <button class="tag filter-tag" data-tag={tag}>{tag}</button>
          ))}
        </div>
      </div>

      <div class="blog-listing__posts" id="blog-posts">
        {posts.map(post => (
          <div
            class="blog-listing__item"
            data-category={post.data.category}
            data-tags={post.data.tags.join(',')}
          >
            <PostCard
              title={post.data.title}
              description={post.data.description}
              pubDate={post.data.pubDate}
              tags={post.data.tags}
              category={post.data.category}
              readingTime={post.data.readingTime}
              slug={post.id}
            />
          </div>
        ))}
      </div>

      <p class="blog-listing__empty" id="blog-empty" hidden>
        No posts match the current filters.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .blog-listing__title {
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .blog-listing__filters {
    margin-bottom: 1.5rem;
  }

  .blog-listing__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .filter-btn {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.4rem 0.8rem;
    background: none;
    border: 1.5px solid var(--border);
    border-radius: 3px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn:hover { border-color: var(--accent); color: var(--accent); }
  .filter-btn--active { border-color: var(--accent); color: var(--accent); background-color: var(--bg-surface); }

  .blog-listing__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .filter-tag { cursor: pointer; background: none; }
  .filter-tag--active { color: var(--accent); border-color: var(--accent); }

  .blog-listing__empty {
    font-style: italic;
    color: var(--text-muted);
    padding: 2rem 0;
  }
</style>

<script>
  const filters = document.getElementById('blog-filters');
  const postsContainer = document.getElementById('blog-posts');
  const emptyMsg = document.getElementById('blog-empty');
  if (!filters || !postsContainer || !emptyMsg) throw new Error('Missing filter elements');

  let activeCategory = 'All';
  let activeTag: string | null = null;

  function applyFilters() {
    const items = postsContainer.querySelectorAll<HTMLElement>('.blog-listing__item');
    let visibleCount = 0;

    items.forEach(item => {
      const cat = item.dataset.category ?? '';
      const tags = (item.dataset.tags ?? '').split(',');
      const matchesCat = activeCategory === 'All' || cat === activeCategory;
      const matchesTag = !activeTag || tags.includes(activeTag);
      const visible = matchesCat && matchesTag;
      item.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    emptyMsg.hidden = visibleCount > 0;
  }

  // Category buttons
  filters.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      activeCategory = btn.dataset.category ?? 'All';
      applyFilters();
    });
  });

  // Tag buttons
  filters.querySelectorAll<HTMLButtonElement>('.filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag ?? '';
      if (activeTag === tag) {
        activeTag = null;
        btn.classList.remove('filter-tag--active');
      } else {
        filters.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('filter-tag--active'));
        btn.classList.add('filter-tag--active');
        activeTag = tag;
      }
      applyFilters();
    });
  });
</script>
```

- [ ] **Step 2: Verify listing**

```bash
npm run dev
```

Open `http://localhost:4321/blog`. Expected: The sample post appears in the listing with working category/tag filters.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog listing page with client-side category and tag filters"
```

---

## Task 15: Tag Pages

**Files:**
- Create: `src/pages/tags/[tag].astro`

- [ ] **Step 1: Create tag page**

Create `src/pages/tags/[tag].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap(p => p.data.tags))];

  return tags.map(tag => ({
    params: { tag },
    props: {
      tag,
      posts: posts
        .filter(p => p.data.tags.includes(tag))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
    },
  }));
}

const { tag, posts } = Astro.props;
---

<BaseLayout
  title={`Posts tagged "${tag}"`}
  description={`Articles about ${tag} by Luis Meraz.`}
>
  <section class="section">
    <div class="container">
      <p class="label" style="margin-bottom: 0.5rem;">Tag</p>
      <h1 style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
        {tag}
      </h1>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        &middot; <a href="/blog" style="color: var(--accent);">View all posts</a>
      </p>

      {posts.map(post => (
        <PostCard
          title={post.data.title}
          description={post.data.description}
          pubDate={post.data.pubDate}
          tags={post.data.tags}
          category={post.data.category}
          readingTime={post.data.readingTime}
          slug={post.id}
        />
      ))}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/tags/[tag].astro
git commit -m "feat: add tag pages for filtered post views"
```

---

## Task 16: Homepage

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create homepage**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import SignupForm from '../components/SignupForm.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 5);
---

<BaseLayout
  title="Luis Meraz"
  description="Luis Meraz — actor and builder. Writing about MCP, local-first architecture, and Apple data integration."
>
  <section class="hero section">
    <div class="container">
      <div class="hero__grid">
        <div class="hero__text">
          <p class="label reveal">Actor & Builder</p>
          <h1 class="hero__heading reveal">I act, I build,<br>I write about both.</h1>
          <p class="hero__description reveal">
            Building <a href="/apple-mcp-bridge" class="hero__link">Apple MCP Bridge</a> —
            your Apple data, any AI agent. Writing about MCP, local-first architecture,
            and the craft of making software.
          </p>
          <div class="hero__ctas reveal">
            <a href="/newsletter" class="btn-primary">Subscribe</a>
            <a href="/blog" class="btn-secondary">Read the blog</a>
          </div>
        </div>
        <div class="hero__image reveal">
          <picture>
            <source
              type="image/avif"
              srcset="/images/optimized/headshots/luis-meraz-headshot-theatrical-900.avif 900w, /images/optimized/headshots/luis-meraz-headshot-theatrical-1600.avif 1600w"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <img
              src="/images/optimized/headshots/luis-meraz-headshot-theatrical-1600.jpg"
              srcset="/images/optimized/headshots/luis-meraz-headshot-theatrical-900.jpg 900w, /images/optimized/headshots/luis-meraz-headshot-theatrical-1600.jpg 1600w"
              sizes="(max-width: 768px) 100vw, 40vw"
              width="4686"
              height="5858"
              alt="Luis Meraz theatrical headshot"
              class="hero__photo"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background-color: var(--bg-warm);">
    <div class="container">
      <p class="label reveal" style="margin-bottom: 0.75rem;">Writing</p>
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
        Latest Posts
      </h2>
      {posts.map(post => (
        <div class="reveal">
          <PostCard
            title={post.data.title}
            description={post.data.description}
            pubDate={post.data.pubDate}
            tags={post.data.tags}
            category={post.data.category}
            readingTime={post.data.readingTime}
            slug={post.id}
          />
        </div>
      ))}
      <div class="reveal" style="margin-top: 1.5rem;">
        <a href="/blog" class="btn-secondary">All posts &rarr;</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    padding: clamp(3rem, 8vh, 6rem) 0;
  }

  .hero__grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(2rem, 4vw, 4rem);
    align-items: center;
  }

  .hero__heading {
    font-size: clamp(2.5rem, 6vw, 4rem);
    margin-bottom: 1rem;
  }

  .hero__description {
    font-size: 1.05rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    max-width: 32rem;
  }

  .hero__link {
    color: var(--accent);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s ease;
  }

  .hero__link:hover { border-bottom-color: var(--accent); }

  .hero__ctas {
    display: flex;
    gap: 0.75rem;
  }

  .hero__photo {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit: cover;
    aspect-ratio: 3 / 4;
  }

  @media (max-width: 768px) {
    .hero__grid {
      grid-template-columns: 1fr;
    }

    .hero__image { order: -1; }

    .hero__photo {
      max-height: 50vh;
      object-position: center 30%;
    }
  }
</style>
```

- [ ] **Step 2: Verify homepage**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: Split hero with headshot, intro text, CTAs, and latest posts section below.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage with split hero, CTAs, and latest posts"
```

---

## Task 17: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="About"
  description="Luis Meraz — actor and builder in Los Angeles. Building Apple MCP Bridge, writing about MCP and local-first architecture."
>
  <section class="section">
    <div class="container">
      <div class="about__grid">
        <div class="about__text">
          <p class="label reveal" style="margin-bottom: 0.5rem;">About</p>
          <h1 class="reveal" style="margin-bottom: 1.5rem;">The short version</h1>

          <div class="prose reveal">
            <p>
              I'm Luis, a bilingual Mexican American in Los Angeles. I act, improvise, clown,
              write, and produce theater and shorts through my company,
              <strong>Do Tell</strong>. I used to write code at Meta and Lyft.
            </p>
            <p>
              Now I'm building <a href="/apple-mcp-bridge">Apple MCP Bridge</a> — a lightweight
              macOS app that makes your Apple data (calendars, contacts, notes, reminders)
              available to any AI agent via MCP. Think of it as Spotlight for AI agents.
            </p>
            <p>
              I'm building this because I hoard my personal data and want it portable to any AI
              agent — not locked inside one company's walled garden. Everything stays on your device.
              No servers, no cloud sync, no data liability.
            </p>
            <p>
              This site is where I write about the process: the architecture decisions, the
              performance benchmarks, the inevitable wrong turns. I also write about MCP, local-first
              principles, Apple integration quirks, and the indie software ethos.
            </p>
            <p>
              I'm not trying to take over the world. I want a product I can care for, love, share,
              and live comfortably with — in the spirit of Sublime Text, Obsidian, and Panic.
            </p>
            <p>
              Beyond all of that, I surf, sail, DJ, and hike with my dog, Manny.
            </p>
          </div>
        </div>
        <div class="about__image reveal">
          <picture>
            <source type="image/avif" srcset="/images/optimized/photos/luis-sailing-640.avif" />
            <img
              src="/images/optimized/photos/luis-sailing-640.jpg"
              width="1536"
              height="2048"
              alt="Luis Meraz sailing"
              class="about__photo"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .about__grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(2rem, 4vw, 4rem);
    align-items: start;
  }

  .about__photo {
    width: 100%;
    height: auto;
    border-radius: 4px;
    position: sticky;
    top: 5rem;
  }

  @media (max-width: 768px) {
    .about__grid {
      grid-template-columns: 1fr;
    }

    .about__photo {
      position: static;
      max-height: 50vh;
      object-fit: cover;
      object-position: center 30%;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add About page bridging actor and builder identities"
```

---

## Task 18: Acting Page

**Files:**
- Create: `src/pages/acting.astro`, `src/components/ReelCard.astro`, `src/components/Gallery.astro`

- [ ] **Step 1: Create ReelCard component**

Create `src/components/ReelCard.astro`:

```astro
---
interface Props {
  vimeoId: string;
  vimeoHash: string;
  title: string;
  label: string;
  posterWebp: string;
  posterJpg: string;
}

const { vimeoId, vimeoHash, title, label, posterWebp, posterJpg } = Astro.props;
---

<a
  class="reel-card"
  href={`https://vimeo.com/${vimeoId}`}
  target="_blank"
  rel="noopener noreferrer"
  data-vimeo-id={vimeoId}
  data-vimeo-hash={vimeoHash}
  data-vimeo-title={title}
  aria-label={`Play ${title}`}
>
  <picture class="reel-picture">
    <source type="image/webp" srcset={posterWebp} />
    <img src={posterJpg} width="960" height="540" class="reel-poster" alt={`${title} preview`} loading="lazy" decoding="async" />
  </picture>
  <span class="reel-card__overlay" aria-hidden="true">
    <span class="reel-card__label">{label}</span>
    <span class="reel-card__play">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M8 6.5v11l9-5.5-9-5.5z" />
      </svg>
    </span>
  </span>
</a>

<style>
  .reel-card {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background-color: #1a1718;
    border-radius: 4px;
  }
  .reel-picture, .reel-poster { width: 100%; height: 100%; }
  .reel-poster { object-fit: cover; transition: transform 0.6s var(--ease-out); }
  .reel-card:hover .reel-poster { transform: scale(1.04); }

  .reel-card__overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, rgba(30,27,24,0.05), rgba(30,27,24,0.45));
  }

  .reel-card__label {
    position: absolute; top: 1rem; left: 1rem;
    font-family: var(--font-heading);
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.8);
    display: inline-flex; align-items: center; gap: 0.5rem;
    text-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .reel-card__label::before {
    content: ''; width: 1.25rem; height: 1px;
    background-color: rgba(255,255,255,0.5);
  }

  .reel-card__play {
    display: flex; align-items: center; justify-content: center;
    width: 3.5rem; height: 3.5rem; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.5);
    background-color: rgba(255,255,255,0.2);
    transition: transform 0.4s var(--ease-out), background-color 0.4s ease;
  }
  .reel-card:hover .reel-card__play { transform: scale(1.1); background-color: rgba(255,255,255,0.28); }
  .reel-card__play svg { margin-left: 2px; }
</style>

<script>
  document.querySelectorAll<HTMLAnchorElement>('.reel-card[data-vimeo-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e as MouseEvent).button !== 0) return;
      e.preventDefault();

      const wrapper = document.createElement('div');
      wrapper.className = 'reel-frame';
      wrapper.style.cssText = 'position:relative;display:block;width:100%;aspect-ratio:16/9;overflow:hidden;background:#1a1718;border-radius:4px;';

      const url = new URL(`https://player.vimeo.com/video/${card.dataset.vimeoId}`);
      if (card.dataset.vimeoHash) url.searchParams.set('h', card.dataset.vimeoHash);
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('dnt', '1');

      const iframe = document.createElement('iframe');
      iframe.src = url.toString();
      iframe.title = card.dataset.vimeoTitle ?? '';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'width:100%;height:100%;border:0;';

      wrapper.appendChild(iframe);
      card.replaceWith(wrapper);
      iframe.focus();
    }, { once: true });
  });
</script>
```

- [ ] **Step 2: Create Gallery component**

Create `src/components/Gallery.astro`:

```astro
---
interface Photo {
  avif: string;
  jpg: string;
  width: number;
  height: number;
  alt: string;
}

interface Props {
  photos: Photo[];
}

const { photos } = Astro.props;
---

<div class="gallery">
  {photos.map(photo => (
    <div class="gallery__item reveal">
      <picture>
        <source type="image/avif" srcset={photo.avif} />
        <img
          src={photo.jpg}
          width={photo.width}
          height={photo.height}
          class="gallery-media"
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  ))}
</div>

<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .gallery__item { overflow: hidden; border-radius: 3px; }
  .gallery-media {
    width: 100%; height: 100%;
    aspect-ratio: 3 / 4; object-fit: cover;
    transition: transform 0.6s var(--ease-out);
  }
  .gallery__item:hover .gallery-media { transform: scale(1.04); }

  @media (max-width: 768px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .gallery { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Create acting page**

Create `src/pages/acting.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ReelCard from '../components/ReelCard.astro';
import Gallery from '../components/Gallery.astro';

const photos = [
  { avif: '/images/optimized/photos/luis-sailing-640.avif', jpg: '/images/optimized/photos/luis-sailing-640.jpg', width: 1536, height: 2048, alt: 'Luis Meraz sailing on the water' },
  { avif: '/images/optimized/photos/do-tell-warm-up-640.avif', jpg: '/images/optimized/photos/do-tell-warm-up-640.jpg', width: 4160, height: 5335, alt: 'Luis Meraz leading a Do Tell warm-up' },
  { avif: '/images/optimized/photos/luis-surfing-384.avif', jpg: '/images/optimized/photos/luis-surfing-384.jpg', width: 384, height: 678, alt: 'Luis Meraz surfing in open water' },
  { avif: '/images/optimized/photos/luis-zach-smackdown-breath-640.avif', jpg: '/images/optimized/photos/luis-zach-smackdown-breath-640.jpg', width: 4160, height: 5436, alt: 'Luis Meraz and Zach performing in Smackdown' },
  { avif: '/images/optimized/photos/do-tell-directing-640.avif', jpg: '/images/optimized/photos/do-tell-directing-640.jpg', width: 4160, height: 6240, alt: 'Luis Meraz directing a Do Tell production' },
  { avif: '/images/optimized/photos/luis-zach-smackdown-stunned-640.avif', jpg: '/images/optimized/photos/luis-zach-smackdown-stunned-640.jpg', width: 3758, height: 5215, alt: 'Luis Meraz and Zach reacting in Smackdown' },
];
---

<BaseLayout
  title="Acting"
  description="Luis Meraz is a bilingual Mexican American actor in Los Angeles who acts, improvises, clowns, writes, and produces."
>
  {/* Hero */}
  <section class="acting-hero">
    <div class="acting-hero__image">
      <picture>
        <source
          type="image/avif"
          srcset="/images/optimized/headshots/luis-meraz-headshot-theatrical-900.avif 900w, /images/optimized/headshots/luis-meraz-headshot-theatrical-1600.avif 1600w"
          sizes="100vw"
        />
        <img
          src="/images/optimized/headshots/luis-meraz-headshot-theatrical-1600.jpg"
          srcset="/images/optimized/headshots/luis-meraz-headshot-theatrical-900.jpg 900w, /images/optimized/headshots/luis-meraz-headshot-theatrical-1600.jpg 1600w"
          sizes="100vw"
          width="4686"
          height="5858"
          alt="Luis Meraz theatrical headshot"
          class="acting-hero__photo"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      <div class="acting-hero__vignette"></div>
    </div>
    <div class="acting-hero__text">
      <p class="label reveal" style="color: var(--accent-soft);">Actor</p>
      <h1 class="acting-hero__name reveal">Luis<br>Meraz</h1>
      <p class="acting-hero__location reveal">Los Angeles</p>
    </div>
  </section>

  {/* About */}
  <section class="section" style="background-color: var(--bg-warm);">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">About</h2>
      <div class="prose reveal" style="max-width: 36rem;">
        <p>
          I'm Luis, a bilingual Mexican American actor passionate about storytelling.
          I used to code at Meta and Lyft. I now inspire people to lead with courage, love,
          and joy through delight in my craft. I act, improvise, clown, and write.
          My production company, Do Tell, produces theater and shorts with rave reviews.
          Beyond entertainment, I surf, sail, DJ, and hike with my dog, Manny.
        </p>
      </div>
    </div>
  </section>

  {/* Reels */}
  <section class="section">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">Reels</h2>
      <div class="reels-grid">
        <div class="reveal">
          <ReelCard
            vimeoId="1130100675"
            vimeoHash="7a233520f4"
            title="Luis Meraz comedy reel"
            label="Comedy"
            posterWebp="https://i.vimeocdn.com/video/2074097254-ef6aef6271b526162af24420351be4343403e89c2d7a57b255cb0b6890fe8f01-d?f=webp&mw=960&q=85"
            posterJpg="https://i.vimeocdn.com/video/2074097254-ef6aef6271b526162af24420351be4343403e89c2d7a57b255cb0b6890fe8f01-d?mw=960&q=85"
          />
        </div>
        <div class="reveal">
          <ReelCard
            vimeoId="1130100691"
            vimeoHash="9eab30c515"
            title="Luis Meraz dramatic reel"
            label="Drama"
            posterWebp="https://i.vimeocdn.com/video/2074097561-483022c7faaf89671864d48981f573f8f00b1d69cd234abe0402ae341108606e-d?f=webp&mw=960&q=85"
            posterJpg="https://i.vimeocdn.com/video/2074097561-483022c7faaf89671864d48981f573f8f00b1d69cd234abe0402ae341108606e-d?mw=960&q=85"
          />
        </div>
      </div>
    </div>
  </section>

  {/* Photos */}
  <section class="section" style="background-color: var(--bg-warm);">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">Photos</h2>
      <Gallery photos={photos} />
    </div>
  </section>

  {/* Resume */}
  <section class="section">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">Resume</h2>
      <div class="reveal">
        <iframe
          src="/files/luis-meraz-actor-resume.pdf#toolbar=0"
          title="Luis Meraz acting resume PDF"
          class="resume-frame"
        ></iframe>
      </div>
      <div class="reveal" style="text-align: center; margin-top: 1.5rem;">
        <a href="/files/luis-meraz-actor-resume.pdf" class="btn-secondary">
          Download Resume &darr;
        </a>
      </div>
    </div>
  </section>

  {/* Contact */}
  <section class="section" style="background-color: var(--bg-accent); min-height: 40vh; display: flex; align-items: center;">
    <div class="container">
      <h2 class="reveal" style="font-size: clamp(2.5rem, 7vw, 5.5rem); line-height: 0.95; border: none; padding: 0; margin-bottom: 1rem;">
        Let's<br>Work Together
      </h2>
      <div class="reveal">
        <p style="font-family: var(--font-heading); font-size: 0.82rem; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.5rem;">@itsluismeraz</p>
        <a href="mailto:contact@luismeraz.com" class="contact-email">contact@luismeraz.com</a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .acting-hero {
    position: relative;
    height: 80vh;
    min-height: 500px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    background-color: #2a2420;
  }
  .acting-hero__image { position: absolute; inset: -1px; }
  .acting-hero__photo { width: 100%; height: 100%; object-fit: cover; object-position: center 50%; }
  .acting-hero__vignette {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(30,27,24,0.05) 0%, rgba(30,27,24,0) 40%, rgba(30,27,24,0.25) 70%, rgba(30,27,24,0.82) 100%);
  }
  .acting-hero__text {
    position: relative; z-index: 2;
    padding: 0 clamp(1.5rem, 5vw, 5rem) clamp(2rem, 6vh, 4rem);
    width: 100%;
  }
  .acting-hero__name {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 11vw, 9rem);
    font-weight: 400; font-style: italic;
    line-height: 0.9; letter-spacing: -0.02em;
    color: #fff; margin-bottom: 0.5rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.15);
  }
  .acting-hero__location {
    font-family: var(--font-heading);
    font-size: 0.78rem; font-weight: 400;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.65);
  }
  .acting-hero .reveal {
    opacity: 0; transform: translateY(1.5rem);
    animation: heroReveal 0.8s var(--ease-out) forwards;
  }
  @keyframes heroReveal { to { opacity: 1; transform: translateY(0); } }
  .acting-hero .reveal:nth-child(1) { animation-delay: 0.2s; }
  .acting-hero .reveal:nth-child(2) { animation-delay: 0.4s; }
  .acting-hero .reveal:nth-child(3) { animation-delay: 0.6s; }

  .reels-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .resume-frame {
    display: block; width: 100%; max-width: 56rem;
    height: 360px; margin: 0 auto;
    border: 0; border-radius: 4px;
    background-color: #fff;
  }

  .contact-email {
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 3.5vw, 2.2rem);
    font-style: italic;
    color: var(--accent);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s ease;
  }
  .contact-email:hover { border-bottom-color: var(--accent); }

  @media (max-width: 768px) {
    .acting-hero { height: 70vh; }
    .reels-grid { grid-template-columns: 1fr; }
    .resume-frame { height: 280px; }
  }
</style>
```

- [ ] **Step 4: Verify acting page**

```bash
npm run dev
```

Open `http://localhost:4321/acting`. Expected: Full-width hero, about section, reels grid with click-to-play, photo gallery, resume embed, and contact section.

- [ ] **Step 5: Commit**

```bash
git add src/components/ReelCard.astro src/components/Gallery.astro src/pages/acting.astro
git commit -m "feat: add Acting page with hero, reels, gallery, resume, and contact"
```

---

## Task 19: Apple MCP Bridge Product Page

**Files:**
- Create: `src/pages/apple-mcp-bridge.astro`

- [ ] **Step 1: Create product page**

Create `src/pages/apple-mcp-bridge.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SignupForm from '../components/SignupForm.astro';

const phases = [
  { num: 1, label: 'Apple Data', desc: 'Calendar, Contacts, Reminders, Notes via native macOS APIs', status: 'current' },
  { num: 2, label: 'Google', desc: 'OAuth localhost flow for Calendar, Contacts, Drive', status: 'planned' },
  { num: 3, label: 'Microsoft 365', desc: 'Outlook, OneDrive, Teams via Graph API', status: 'planned' },
  { num: 4, label: 'Local Files', desc: 'Documents, Downloads, Desktop with full-text search', status: 'planned' },
  { num: 5, label: 'Browser Data', desc: 'History and bookmarks from Safari, Chrome, Arc', status: 'planned' },
];

const dataSources = ['Calendar', 'Contacts', 'Notes', 'Reminders'];
---

<BaseLayout
  title="Apple MCP Bridge"
  description="Apple MCP Bridge — connect Apple Calendar, Contacts, Notes, and Reminders to any AI agent. Local-first, privacy by architecture."
>
  {/* Hero */}
  <section class="section product-hero">
    <div class="container">
      <p class="label reveal">Apple MCP Bridge</p>
      <h1 class="product-hero__title reveal">Your Apple data,<br>any AI agent.</h1>
      <p class="product-hero__subtitle reveal">
        Apple's personal data has no OAuth, no REST API. Cloud-hosted MCP connectors can't reach it.
        Apple MCP Bridge is a lightweight macOS app that indexes your data locally and exposes it
        as MCP tools for any AI client.
      </p>
      <p class="product-hero__mental-model reveal">
        Think of it as <strong>Spotlight for AI agents.</strong>
      </p>
    </div>
  </section>

  {/* How it works */}
  <section class="section" style="background-color: var(--bg-warm);">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">How it works</h2>
      <div class="flow reveal">
        <div class="flow__step">
          <p class="flow__label">Your data</p>
          <div class="flow__items">
            {dataSources.map(src => <span class="flow__item">{src}</span>)}
          </div>
        </div>
        <div class="flow__arrow" aria-hidden="true">&rarr;</div>
        <div class="flow__step">
          <p class="flow__label">Local index</p>
          <div class="flow__items">
            <span class="flow__item flow__item--highlight">DuckDB</span>
          </div>
        </div>
        <div class="flow__arrow" aria-hidden="true">&rarr;</div>
        <div class="flow__step">
          <p class="flow__label">MCP tools</p>
          <div class="flow__items">
            <span class="flow__item flow__item--highlight">30+ tools</span>
          </div>
        </div>
        <div class="flow__arrow" aria-hidden="true">&rarr;</div>
        <div class="flow__step">
          <p class="flow__label">Any AI client</p>
          <div class="flow__items">
            <span class="flow__item">Claude</span>
            <span class="flow__item">Cursor</span>
            <span class="flow__item">Any MCP client</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Performance */}
  <section class="section">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">Performance</h2>
      <div class="perf reveal">
        <div class="perf__card perf__card--local">
          <p class="perf__value">2-4ms</p>
          <p class="perf__label">Local columnar query</p>
        </div>
        <div class="perf__vs">vs</div>
        <div class="perf__card perf__card--cloud">
          <p class="perf__value">50-300ms</p>
          <p class="perf__label">Cloud API round-trip</p>
        </div>
      </div>
      <p class="reveal" style="color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem;">
        Everything stays on-device. No servers, no cloud sync, no data liability.
      </p>
    </div>
  </section>

  {/* Waitlist */}
  <section class="section" style="background-color: var(--bg-warm);">
    <div class="container" style="max-width: 36rem;">
      <div class="reveal" style="text-align: center;">
        <h2 style="margin-bottom: 0.5rem;">Get notified when it ships</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          Phase 1 is in prototype. Be the first to know when it's ready.
        </p>
      </div>
      <div class="reveal">
        <SignupForm
          heading=""
          description=""
          tag="waitlist"
        />
      </div>
    </div>
  </section>

  {/* Roadmap */}
  <section class="section">
    <div class="container">
      <h2 class="reveal" style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">Roadmap</h2>
      <div class="roadmap">
        {phases.map(phase => (
          <div class:list={['roadmap__phase', 'reveal', { 'roadmap__phase--current': phase.status === 'current' }]}>
            <span class="roadmap__num">Phase {phase.num}</span>
            <h3 class="roadmap__title">{phase.label}</h3>
            <p class="roadmap__desc">{phase.desc}</p>
            {phase.status === 'current' && <span class="roadmap__badge">In Progress</span>}
          </div>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .product-hero { padding: clamp(3rem, 8vh, 6rem) 0; }
  .product-hero__title { font-size: clamp(2.5rem, 6vw, 4.5rem); margin-bottom: 1.25rem; }
  .product-hero__subtitle { font-size: 1.1rem; color: var(--text-muted); line-height: 1.7; max-width: 38rem; margin-bottom: 1rem; }
  .product-hero__mental-model { font-size: 1.05rem; color: var(--text); }

  .flow { display: flex; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
  .flow__step { flex: 1; min-width: 120px; }
  .flow__label { font-family: var(--font-heading); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-soft); margin-bottom: 0.5rem; }
  .flow__items { display: flex; flex-direction: column; gap: 0.3rem; }
  .flow__item { font-size: 0.85rem; color: var(--text-muted); padding: 0.3rem 0.6rem; background: var(--bg-surface); border-radius: 3px; }
  .flow__item--highlight { color: var(--accent); font-weight: 600; }
  .flow__arrow { font-size: 1.5rem; color: var(--text-muted); align-self: center; padding-top: 1rem; }

  .perf { display: flex; align-items: center; gap: 1.5rem; }
  .perf__card { padding: 1.5rem 2rem; border-radius: 4px; text-align: center; }
  .perf__card--local { background: var(--bg-surface); border: 2px solid var(--accent); }
  .perf__card--cloud { background: var(--bg-surface); border: 2px solid var(--border); }
  .perf__value { font-family: var(--font-display); font-size: 2rem; font-style: italic; color: var(--text); }
  .perf__label { font-family: var(--font-heading); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-top: 0.25rem; }
  .perf__vs { font-family: var(--font-heading); font-size: 0.8rem; color: var(--text-muted); }

  .roadmap { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
  .roadmap__phase { padding: 1.25rem; background: var(--bg-surface); border-radius: 4px; border: 1px solid var(--border); }
  .roadmap__phase--current { border-color: var(--accent); }
  .roadmap__num { font-family: var(--font-heading); font-size: 0.62rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-soft); }
  .roadmap__title { font-size: 1.1rem; margin: 0.25rem 0; }
  .roadmap__desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; }
  .roadmap__badge { display: inline-block; font-family: var(--font-heading); font-size: 0.58rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.5rem; background: var(--accent); color: #fff; border-radius: 2px; margin-top: 0.5rem; }

  @media (max-width: 768px) {
    .flow { flex-direction: column; }
    .flow__arrow { transform: rotate(90deg); align-self: center; padding: 0; }
    .perf { flex-direction: column; }
  }
</style>
```

- [ ] **Step 2: Verify product page**

```bash
npm run dev
```

Open `http://localhost:4321/apple-mcp-bridge`. Expected: Problem statement, flow diagram, performance comparison, waitlist form, and roadmap.

- [ ] **Step 3: Commit**

```bash
git add src/pages/apple-mcp-bridge.astro
git commit -m "feat: add Apple MCP Bridge product page with waitlist and roadmap"
```

---

## Task 20: Newsletter & 404 Pages

**Files:**
- Create: `src/pages/newsletter.astro`, `src/pages/404.astro`

- [ ] **Step 1: Create newsletter page**

Create `src/pages/newsletter.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SignupForm from '../components/SignupForm.astro';
import { getCollection } from 'astro:content';

const recentPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 5);
---

<BaseLayout
  title="Newsletter"
  description="Subscribe to Luis Meraz's newsletter — posts on MCP, Apple integration, local-first architecture, and indie software."
>
  <section class="section">
    <div class="container" style="max-width: 36rem;">
      <h1 class="reveal" style="margin-bottom: 0.75rem;">Newsletter</h1>
      <div class="prose reveal">
        <p>
          I write about MCP, Apple integration, local-first architecture, performance, and the
          indie software ethos. Roughly weekly, always honest, never spam. Unsubscribe anytime.
        </p>
      </div>
      <div class="reveal" style="margin: 2rem 0;">
        <SignupForm heading="" description="" />
      </div>
      {recentPosts.length > 0 && (
        <div class="reveal">
          <p class="label" style="margin-bottom: 0.75rem;">Recent posts</p>
          <ul style="list-style: none;">
            {recentPosts.map(post => (
              <li style="margin-bottom: 0.5rem;">
                <a href={`/blog/${post.id}`} style="color: var(--accent); font-style: italic;">
                  {post.data.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Not Found"
  description="This page doesn't exist."
  noindex
>
  <section class="section" style="min-height: 50vh; display: flex; align-items: center;">
    <div class="container" style="text-align: center;">
      <p class="label" style="margin-bottom: 0.5rem;">404</p>
      <h1 style="margin-bottom: 1rem;">Page not found</h1>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div style="display: flex; gap: 0.75rem; justify-content: center;">
        <a href="/" class="btn-primary">Home</a>
        <a href="/blog" class="btn-secondary">Blog</a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/newsletter.astro src/pages/404.astro
git commit -m "feat: add Newsletter and 404 pages"
```

---

## Task 21: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create RSS feed**

Create `src/pages/rss.xml.ts`:

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Luis Meraz',
    description: 'Writing about MCP, Apple integration, local-first architecture, and indie software.',
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
```

- [ ] **Step 2: Verify RSS**

```bash
npm run dev
```

Open `http://localhost:4321/rss.xml`. Expected: Valid XML with the sample post entry.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed with full post metadata"
```

---

## Task 22: JSON-LD Structured Data

**Files:**
- Modify: `src/components/SEO.astro`

- [ ] **Step 1: Add JSON-LD to SEO component**

Add the following before the closing tag in `src/components/SEO.astro`:

```astro
{/* Add after the Twitter meta tags */}

{/* JSON-LD */}
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Luis Meraz",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Luis Meraz",
      url: siteUrl,
      jobTitle: "Actor & Software Developer",
      email: "mailto:contact@luismeraz.com",
      sameAs: [
        "https://www.imdb.com/name/nm16037724/",
        "https://www.instagram.com/itsluismeraz",
        "https://www.tiktok.com/@itsluismeraz",
        "https://github.com/lmeraz",
      ],
    },
    ...(ogType === 'article' ? [{
      "@type": "Article",
      headline: title,
      description: description,
      image: ogImageUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime ?? publishedTime,
      author: { "@id": `${siteUrl}/#person` },
      publisher: { "@id": `${siteUrl}/#person` },
      mainEntityOfPage: canonical,
    }] : []),
  ],
})} />
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SEO.astro
git commit -m "feat: add JSON-LD structured data to SEO component"
```

---

## Task 23: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for GitHub Pages deployment"
```

---

## Task 24: Build Verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build completes with no errors. Output in `dist/` directory.

- [ ] **Step 2: Preview the built site**

```bash
npm run preview
```

Open `http://localhost:4321`. Walk through each page:
- `/` — Homepage with hero, latest posts
- `/about` — About page with prose and photo
- `/blog` — Blog listing with filters
- `/blog/first-post` — Sample post with syntax highlighting, signup, author card
- `/tags/mcp` — Tag page
- `/acting` — Full acting portfolio
- `/apple-mcp-bridge` — Product page with waitlist
- `/newsletter` — Signup page
- `/rss.xml` — RSS feed
- Toggle dark mode on each page

- [ ] **Step 3: Verify SEO output**

Check the HTML source of any page for:
- `<title>` tag
- `<meta name="description">`
- `<link rel="canonical">`
- `og:*` meta tags
- `twitter:*` meta tags
- JSON-LD `<script>` block
- RSS `<link rel="alternate">`

- [ ] **Step 4: Commit any fixes**

If any issues found during verification, fix and commit:

```bash
git add -A
git commit -m "fix: address build verification issues"
```

---

## Task 25: Clean Up Default Files

- [ ] **Step 1: Remove Astro default template files**

If any default template files from `npm create astro` still exist (like a default `src/pages/index.astro` before we replaced it), remove them:

```bash
# Check for any leftover default files
ls src/pages/
```

Remove anything not in our file map.

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "chore: remove default Astro template files"
```
