# AINextus — Project Roadmap & Architecture

## Vision
**The Bloomberg Terminal for AI** — a single, authoritative source for discovering, comparing, and tracking every tool, model, platform, news story, and video in the AI ecosystem. Where Futurepedia covers tools, AINextus covers *everything*.

---

## Competitive Advantage

| Feature | Futurepedia | AINextus |
|---|---|---|
| AI Tool Catalog | ✓ ~4,000 tools | ✓ 4,000+ tools, deeper data |
| LLM Model Tracking | ✗ | ✓ Benchmarks, pricing, changelogs |
| Infrastructure/Platforms | ✗ | ✓ AWS Bedrock, Replicate, HF, etc. |
| AI News | ✗ | ✓ 200+ curated sources |
| Video Library | Partial (own channel only) | ✓ Aggregated from all top channels |
| Side-by-Side Comparison | ✗ | ✓ Full comparison engine |
| Smart Filters | Basic | ✓ 15+ filter dimensions |
| Pricing Change Alerts | ✗ | ✓ Realtime alerts |
| AI-Powered Discovery | ✗ | ✓ "Find me a tool that does X" |
| Open Source Flag | ✗ | ✓ |
| API Availability | ✗ | ✓ |
| Review Depth | Stars only | ✓ Structured multi-dimension reviews |
| Personalization | ✗ | ✓ Saved tools, recommendations |
| Revenue transparency | Sponsor-based | ✓ Disclosed, non-ranking-influencing |

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router) — essential for SEO
- **Styling:** Tailwind CSS + shadcn/ui
- **Search UI:** Algolia InstantSearch or custom with Postgres FTS
- **State:** Zustand (client) + React Query (server state)
- **Charts/Benchmarks:** Recharts or Tremor

### Backend
- **Runtime:** Node.js (Next.js API routes) or separate Express/Fastify service
- **Database:** PostgreSQL 15 (primary) + Redis (caching/sessions)
- **Search:** Algolia (paid, best DX) OR Elasticsearch (self-hosted) OR Postgres full-text (free, good enough to start)
- **File Storage:** Cloudflare R2 or AWS S3 (logos, screenshots)
- **Queue:** BullMQ + Redis (background jobs: scraping, syncing)

### Infrastructure
- **Hosting:** Vercel (frontend) + Railway or Render (backend + Postgres)
- **CDN:** Cloudflare
- **Email:** Resend or Postmark
- **Auth:** Clerk (fastest to ship) or Supabase Auth

### Data Pipelines (critical for staying fresh)
- **News scraping:** RSS feeds + Puppeteer/Playwright for JS-heavy sites
- **GitHub stats:** GitHub API (stars, forks for open-source tools)
- **YouTube sync:** YouTube Data API v3 (daily sync of top AI channels)
- **Pricing monitor:** Scheduled job scraping pricing pages, alert on changes
- **Model benchmarks:** Scrape LMSYS Leaderboard, Papers With Code

---

## Phase 1 — Foundation (Weeks 1–6)
**Goal:** Launch with catalog + filtering. Get to 1,000 tools.

### Core Features
- [ ] Next.js project setup with Postgres + Prisma/Drizzle
- [ ] Tool catalog with basic CRUD
- [ ] Category + tag system
- [ ] Search (Postgres FTS to start, migrate to Algolia at scale)
- [ ] Filtering: category, price, API, open-source, platform
- [ ] Tool detail pages (SEO-critical: `/tool/chatgpt`)
- [ ] Company pages (`/company/openai`)
- [ ] User auth (sign up, sign in, save tools)
- [ ] Admin panel for adding/editing tools
- [ ] Tool submission form (community)
- [ ] Basic sitemap + OpenGraph metadata

### Data
- [ ] Seed 200 top tools manually with full data
- [ ] Write scraper for basic tool metadata
- [ ] Import categories + companies

### Design System
- [ ] Dark theme UI system
- [ ] Tool card component
- [ ] Filter sidebar
- [ ] Search bar with instant results

---

## Phase 2 — Differentiation (Weeks 7–12)
**Goal:** Add the features that Futurepedia doesn't have.

### LLM Model Hub
- [ ] Models table with benchmarks, pricing, context windows
- [ ] Model detail pages (`/models/gpt-4o`)
- [ ] Benchmark comparison charts
- [ ] Pricing calculator (tokens/cost estimator)
- [ ] Model changelog tracking

### News Feed
- [ ] RSS feed aggregator (TechCrunch, VentureBeat, The Verge, Wired, Ars Technica, MIT Tech Review)
- [ ] AI-powered categorization (pipe through Claude API)
- [ ] News article pages with related tools/models
- [ ] Daily email digest (Resend)
- [ ] Category filtering + hot/trending detection

### Video Library
- [ ] YouTube Data API integration
- [ ] Curate 30+ top AI YouTube channels
- [ ] Video pages with tool tagging (`/videos/...`)
- [ ] Filter by category, channel, difficulty

### Reviews System
- [ ] Multi-dimension review form (overall, ease, value, features, support)
- [ ] Review moderation queue
- [ ] Review upvotes/downvotes
- [ ] Review-based sorting

---

## Phase 3 — Intelligence Layer (Weeks 13–20)
**Goal:** Become the smartest AI directory on the internet.

### Comparison Engine
- [ ] Select up to 3 tools → side-by-side comparison page
- [ ] Shareable comparison URLs (`/compare/chatgpt-vs-claude-vs-gemini`)
- [ ] Comparison SEO pages (pre-generate popular comparisons)
- [ ] "Also consider" recommendations

### AI-Powered Features
- [ ] Natural language tool finder: "Find me a free image generator with API access"
- [ ] Personalized recommendations based on saved tools + usage patterns
- [ ] Auto-generate tool summaries and "best for" labels using Claude API
- [ ] Detect duplicate submissions automatically

### Platforms / Infrastructure Section
- [ ] Hugging Face, Replicate, Together AI, Groq, AWS Bedrock, Azure OpenAI, etc.
- [ ] "Where to run this model" — show available platforms for each LLM
- [ ] Pricing comparisons across providers for same model

### Alerting System
- [ ] Price change alerts (tool changes pricing tier)
- [ ] New tool in category alerts
- [ ] Model release alerts
- [ ] Weekly digest email (top news + trending tools + new tools in your categories)

---

## Phase 4 — Community & Monetization (Weeks 21–30)
**Goal:** Build revenue and community flywheel.

### Community
- [ ] User profiles with saved tools and reviews
- [ ] Tool lists/collections (curated by users/editors: "Best tools for solo developers")
- [ ] Leaderboards: top reviewers, most-saved tools
- [ ] "Verified user" badge for reviews (via OAuth with tool)

### SEO Expansion (massive traffic driver)
- [ ] "Best AI tools for [use case]" editorial pages (pre-written + AI-assisted)
- [ ] "vs" comparison pages: 500+ auto-generated (`/compare/X-vs-Y`)
- [ ] Programmatic category pages: `/ai-tools/free-image-generators`
- [ ] Tool changelog pages: `/tool/chatgpt/changelog`
- [ ] Model release timeline

### Monetization (Honest Model)
1. **Pro subscriptions** ($12/mo): unlimited saves, advanced filters, API access to catalog, comparison exports, email alerts
2. **Featured listings** (disclosed): tools can pay to appear in "Featured" row — clearly labeled, never affects ratings
3. **Affiliate links**: clearly disclosed. Tools with affiliate programs (Jasper, Copy.ai, etc.)
4. **API access** ($99/mo): developers can query the catalog programmatically
5. **Sponsored newsletters**: the weekly digest with clearly disclosed sponsorship
6. **Data exports**: bulk CSV/JSON of tool catalog for researchers

**What NOT to do:** Never let payment affect star ratings or category rankings. Futurepedia's disclosed "compensation may affect results" is their trust liability — make this your trust advantage.

---

## SEO Strategy (Your #1 Growth Channel)

Search is how Futurepedia gets most of its traffic. You can outrank them by going deeper.

### High-value page types to build:
1. `/tool/[slug]` — individual tool pages (4,000+ pages)
2. `/models/[slug]` — LLM model pages (80+ pages)
3. `/compare/[tool-a]-vs-[tool-b]` — comparison pages (500+ pages, massive search volume)
4. `/ai-tools/[category]` — category pages
5. `/ai-tools/[category]/free` — "free X tools" pages
6. `/ai-tools/best/[use-case]` — "best tools for copywriting" etc.
7. `/news` — daily indexed news
8. `/company/[slug]` — company pages

### Target keywords with high volume + low competition:
- "[tool name] vs [tool name]" — e.g. "ChatGPT vs Claude" (2.2M searches/mo)
- "best AI tools for [job role]" — designer, developer, marketer, etc.
- "[tool name] pricing" — pricing pages rank very well
- "[tool name] API" — developer searches
- "free AI [category]" — huge volume
- "[model name] benchmark" — growing fast

---

## Data Quality Commitment (Your True Moat)

The single biggest differentiator vs. Futurepedia is **data freshness and accuracy**. Build automated pipelines for:

- **Daily:** News articles scraped + categorized, YouTube videos synced, GitHub stars updated
- **Weekly:** Tool pricing pages checked for changes, new tools from HN/ProductHunt detected, LMSYS leaderboard scraped
- **Monthly:** Full tool verification pass by editors, model benchmark updates, company funding data refresh

Add a "Last verified" date to every tool profile. That transparency alone will build trust.

---

## Launch Checklist

- [ ] Domain registered (e.g. `ainexus.ai`, `aibase.io`, `theaistack.com`)
- [ ] Analytics: Plausible (privacy-friendly) + Posthog (product analytics)
- [ ] Error tracking: Sentry
- [ ] Uptime monitoring: Better Uptime
- [ ] Legal: Privacy Policy, Terms of Service, Advertiser Disclosure
- [ ] Social: Twitter/X, LinkedIn, newsletter (start before launch)
- [ ] Initial 200-tool seed dataset ready
- [ ] Submit to Product Hunt (time for max upvotes: Tuesday 12:01 AM PST)
- [ ] Reach out to AI newsletters for coverage (The Rundown AI, TLDR AI, Ben's Bites)
