# Ambition Medical Aesthetics — Website

A fully self-owned, dependency-free static website. No page builder, no subscription, no external CDNs — every file (HTML, CSS, JS, fonts, images) lives in this folder and belongs to you.

**Design language** (Venetian-spa inspired, quiet luxury): flat champagne-gold and ivory canvases, letter-by-letter serif headline reveals, dramatically rounded image panels, pill-shaped serif buttons, an à-la-carte "menu" presentation for offers, and a real before/after slider + proof carousel.

## What's inside

| Path | Purpose |
|---|---|
| `index.html` | Homepage — hero, philosophy, treatments, offers, studio, reviews, gallery, journal preview, FAQ, locations |
| `services.html` | Full treatment menu (Face / Body / Injectables / Wellness) |
| `offers.html` | Current promos ($99 sculpting combo, $119 lymphatic, $299 PRP, HydroGlow + free LED) |
| `contact.html` | Booking form + both locations, hours, map links |
| `blog.html` + `blog/*.html` | The Journal — SEO/GEO-optimized articles with FAQ & Article schema, each ending in a "More from the Journal" related-posts section |
| `privacy.html`, `terms.html`, `404.html` | Legal + error pages |
| `sitemap.xml`, `robots.txt`, `llms.txt` | SEO + AI-search files (robots.txt explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, etc.) |
| `assets/` | Self-hosted fonts (Cormorant Garamond + Jost), optimized WebP images, CSS, JS |

## Preview locally

The plain `python3 -m http.server` command aggressively caches HTML in the browser, which makes edits look like they "didn't work." Use the no-cache version instead:

```bash
cd ambition-medical-aesthetics
python3 -m http.server 8737
```

Then open http://localhost:8737 — and **hard-refresh** (Cmd+Shift+R) after every change, or open a private/incognito window, since the browser will otherwise cache the page.

---

## Deploying to your real domain

You have two good options. **Start with Netlify Drop if you want it live in the next 5 minutes.** Move to Cloudflare Pages (or come back to it later) once you're doing regular updates — it makes every future change auto-publish with zero manual steps.

### Option A — Netlify Drop (fastest, zero setup, good for going live today)

1. Go to **https://app.netlify.com/drop** in a browser.
2. Drag the whole `ambition-medical-aesthetics` folder onto the page.
3. Netlify gives you a live URL in seconds (like `random-name-123.netlify.app`).
4. In Netlify's site settings → **Domain management** → add your custom domain `ambitionmedicalaesthetics.com`, then update your domain's DNS records as Netlify instructs (usually just pointing a CNAME/A record).
5. **To update the site later with this method:** re-drag the updated folder onto the same site in Netlify. Every update means a fresh drag-and-drop.

### Option B — Cloudflare Pages via GitHub (recommended long-term — auto-deploys on every update)

This is the better path once you're publishing blog posts regularly, because updating the live site becomes just "push to GitHub" — no manual re-uploading, ever.

**One-time setup:**
1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new **empty** repository (no README/license) at https://github.com/new — call it e.g. `ambition-website`.
3. In this folder, run:
   ```bash
   git add -A
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ambition-website.git
   git push -u origin main
   ```
4. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the repo you just pushed.
5. Build settings: leave **Build command** empty, set **Build output directory** to `/` (the repo root). Click **Save and Deploy**.
6. Once deployed, go to the Pages project → **Custom domains** → add `ambitionmedicalaesthetics.com` (and `www.` if you use it) → follow the DNS instructions shown (if your domain is already on Cloudflare, this is one click).

**To update the live site after this is set up, forever:**
```bash
git add -A
git commit -m "describe what changed"
git push
```
Cloudflare rebuilds and deploys automatically, live in under a minute. No dashboard, no manual upload.

> When the domain points here, the old GoHighLevel site is fully replaced. Canonical URLs in the HTML already point at `ambitionmedicalaesthetics.com`, so nothing else needs to change.

---

## How to add a new blog post

Every post follows the same pattern. Fastest way: **just ask me** (in a new session, in this same project folder) — "add a blog post about [topic]" — and I'll write it following the house style (TL;DR box, FAQ schema, local SEO keywords, ends with 3 related posts) and wire it into `blog.html` and `sitemap.xml` automatically.

To do it yourself:

1. **Copy an existing post** as your starting template, e.g.:
   ```bash
   cp blog/hydroglow-facial-guide.html blog/your-new-post-slug.html
   ```
2. **Edit the new file:**
   - `<title>` and `<meta name="description">` — unique, keyword-rich, under ~60/155 characters.
   - `<link rel="canonical">` and the two `og:` tags — update the URL/slug.
   - The `<script type="application/ld+json">` blocks (there are two: `BlogPosting` and `FAQPage`) — update `headline`, `datePublished`, `mainEntityOfPage`, and the FAQ questions/answers to match your real content.
   - The `.article__meta` line (category, date, read time), `<h1>`, the `.tldr` box (this is the part AI answers and Google's featured snippets quote directly — make it a tight, standalone summary), and the article body.
   - The `.faq` block near the bottom — should match the FAQPage schema exactly.
   - The **"More from the Journal"** section at the very bottom — swap in 3 *other* real post links/images (not itself).
3. **Add a card to `blog.html`** — copy one `<article class="bcard">` block in the `.bgrid`, point it at your new slug, image, category, date, title, and one-line excerpt.
4. **Add it to `sitemap.xml`** — one `<url><loc>...</loc>...</url>` line, same pattern as the existing blog entries.
5. **Optionally add it to `llms.txt`** under the Journal bullet list, and update the homepage's "From the Journal" 3-card section in `index.html` if you want it featured there.
6. Preview locally, hard-refresh, check it looks right, then commit + push (see deploy section above) — it goes live automatically.

## One thing to activate: the contact form

Forms post to [FormSubmit](https://formsubmit.co) (free, no account) addressed to `ambitionmedicalaesthetics@gmail.com`. The **first** submission after going live sends a confirmation email to that inbox — click "Activate" once and all future submissions arrive by email.

Prefer your own booking system (e.g. your existing GHL calendar, Calendly, Square)? Just change the `action=` URL on the form in `contact.html`, or replace the form with an embed.

## ⚠️ One placeholder still needs real content before launch

The **"Real People. Real Results."** section on the homepage ships with sample review quotes (marked with an HTML comment in `index.html`). Replace each quote/name with a **real Google review**, and make sure the 5.0 badge reflects your actual current Google rating — publishing invented testimonials violates FTC rules. The "Read Our Reviews" button already links to your Google Maps listing.

(The before/after slider and proof carousel already use real client photos.)

## After launch — SEO/AI checklist

1. Google Search Console → add property → submit `sitemap.xml`.
2. Bing Webmaster Tools → same (Bing powers ChatGPT search).
3. Google Business Profile: make sure both locations link to the site — this is the #1 local-ranking lever.
4. Keep publishing Journal posts (1–2/month) using the pattern above.
5. Update offer prices in `offers.html` + `llms.txt` whenever promos change.

## Editing

- Colors/typography: CSS variables at the top of `assets/css/style.css`.
- All animations/interactions: `assets/js/main.js` (vanilla JS).
- Images: `assets/img/` (WebP, already optimized; `-sm` variants for mobile cards).
- Chat/FAQ widget answers: search `main.js` for `CONCIERGE_TREE` — plain-language Q&A tree, easy to extend.
