# DeskSetupLab — Amazon Affiliate Site

**Amazon Associate ID: affiliater07c-20**

A production-ready, programmatic SEO affiliate site built with Next.js 15, TypeScript, TailwindCSS, and ISR. Designed to scale to millions of monthly visitors.

---

## Architecture Overview

```
desksetuplab.com/
├── /                          → Homepage (ISR: 1h)
├── /best/[category]           → Best-Of pages (ISR: 24h)  ← Highest SEO value
├── /review/[slug]             → Product reviews (ISR: 24h)
├── /compare/[slug]            → VS comparisons (ISR: 24h) ← Auto-generated
├── /buying-guide/[slug]       → Buying guides (ISR: 24h)
├── /category/[slug]           → Category browsing (ISR: 1h)
├── /brand/[slug]              → Brand pages
├── /deals                     → Active deals (ISR: 15min)
├── /go/[asin]                 → Affiliate redirect (no-cache)
├── /sitemap.xml               → Auto-generated sitemap
└── /robots.txt                → Blocks /go/ from indexing
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Add your keys to .env.local

# 4. Run dev server
npm run dev
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then redeploy for production
vercel --prod
```

## Adding Products

Edit `lib/products.ts` and add to the `RAW_PRODUCTS` array:

```typescript
{
  id: "product-id",
  slug: "product-name-review",   // used in /review/[slug]
  name: "Product Full Name",
  brand: "Brand Name",
  asin: "B0XXXXXXXXX",           // Amazon ASIN (10 chars)
  category: "standing-desks",    // see types/index.ts
  price: 299,
  rating: 8.5,                   // 0-10
  image: "https://m.media-amazon.com/...",
  shortDescription: "...",
  pros: ["...", "..."],
  cons: ["...", "..."],
  specs: { "Key": "Value" },
  badge: "Best Value",           // optional
  inStock: true,
  lastUpdated: "2026-06-01",
}
```

The `affiliateUrl` is auto-generated as `/go/[asin]` → redirects to Amazon with tag `affiliater07c-20`.

## AI Content Generation

```bash
# Generate a product review (requires OPENAI_API_KEY or GEMINI_API_KEY)
npm run generate-content -- --type review --product "flexispot-e7"

# Generate a best-of page
npm run generate-content -- --type best --category "standing desks"

# Generate a blog post
npm run generate-content -- --type blog --topic "standing desk health benefits"

# Use Gemini instead
npm run generate-content -- --type review --product "uplift-v2" --provider gemini

# Preview prompt without calling API
npm run generate-content -- --type review --product "test" --dry-run
```

## ISR Revalidation

Trigger on-demand page updates after content changes:

```bash
# Revalidate all priority pages
REVALIDATION_SECRET=your-secret npm run generate-sitemap

# Revalidate a specific page
REVALIDATION_SECRET=your-secret npm run generate-sitemap -- --page=/review/flexispot-e7-standing-desk
```

Or via API:
```bash
curl -X POST "https://www.desksetuplab.com/api/revalidate?secret=YOUR_SECRET&path=/best/standing-desks"
```

## SEO Features (Auto-Generated)

Every page automatically gets:
- ✅ Meta title & description (dynamic, keyword-optimized)
- ✅ Open Graph + Twitter cards
- ✅ Canonical URLs
- ✅ JSON-LD Schema (Review, Product, FAQ, BreadcrumbList, ItemList)
- ✅ Sitemap.xml (all pages)
- ✅ robots.txt (blocks /go/ redirects)

## Revenue Model

| Page Type | Traffic | Intent | Avg. Commission |
|-----------|---------|--------|-----------------|
| /best/[cat] | High | Purchase | $5–30/click |
| /review/[product] | High | Purchase | $5–30/click |
| /compare/[vs] | Medium | Purchase | $5–25/click |
| /buying-guide | Medium | Research | $3–15/click |
| /category | Medium | Browse | $3–10/click |
| /deals | Medium | Purchase | $5–40/click |

**Revenue Projection:**
- 10K/day visitors → ~$300–1,000/day (3% conversion, avg $10/commission)
- 100K/day visitors → $3,000–10,000/day
- 1M/day visitors → $30,000–100,000/day

## Amazon Associate Compliance

Per Amazon Associates Operating Agreement:
- ✅ Associate ID (`affiliater07c-20`) in ALL affiliate links
- ✅ Disclosure banner in Header (sitewide)
- ✅ Disclosure notice on every review/best-of page
- ✅ Amazon disclosure in Footer (sitewide)
- ✅ `/disclosure` page with full Amazon Associates statement
- ✅ Redirect links use 302 (temporary), not 301
- ✅ No cached affiliate redirects (`Cache-Control: no-store`)
- ✅ `rel="noopener noreferrer nofollow sponsored"` on external affiliate links
- ✅ `/go/[asin]` blocked from indexing via robots.txt and X-Robots-Tag

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS 3 |
| Content | MDX (next-mdx-remote) |
| Rendering | ISR (Incremental Static Regeneration) |
| Hosting | Vercel |
| Images | next/image + Amazon CDN |
| SEO | next/metadata + JSON-LD |
| Fonts | Google Fonts (Inter + Sora) |

---

*DeskSetupLab is a participant in the Amazon Services LLC Associates Program (ID: affiliater07c-20)*
