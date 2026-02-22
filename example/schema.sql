-- ================================================================
-- AI NEXUS — COMPLETE DATABASE SCHEMA
-- PostgreSQL 15+
-- ================================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent";      -- accent-insensitive search

-- ================================================================
-- USERS & AUTH
-- ================================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team', 'enterprise')),
  -- Preferences
  preferred_categories  TEXT[],
  email_digest         BOOLEAN DEFAULT TRUE,
  email_alerts         BOOLEAN DEFAULT TRUE,
  -- Metadata
  last_active   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ================================================================
-- CATEGORIES & TAGS
-- ================================================================

CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,        -- 'image-generation'
  name        TEXT NOT NULL,               -- 'Image Generation'
  description TEXT,
  icon        TEXT,
  parent_id   INT REFERENCES categories(id),
  sort_order  INT DEFAULT 0,
  tool_count  INT DEFAULT 0,              -- denormalized for perf
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  slug  TEXT UNIQUE NOT NULL,
  name  TEXT NOT NULL,
  color TEXT DEFAULT '#475569'
);

-- ================================================================
-- COMPANIES
-- ================================================================

CREATE TABLE companies (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  website       TEXT,
  logo_url      TEXT,
  hq_country    TEXT,
  founded_year  INT,
  employee_range TEXT,  -- '1-10', '11-50', '51-200', '200+'
  funding_stage TEXT,   -- 'bootstrapped', 'seed', 'series-a', 'public'
  total_funding_usd BIGINT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- AI TOOLS  (core catalog)
-- ================================================================

CREATE TABLE tools (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tagline         TEXT,           -- short 1-line description
  description     TEXT,           -- full description (markdown OK)
  logo_url        TEXT,
  screenshot_urls TEXT[],
  website_url     TEXT NOT NULL,
  company_id      INT REFERENCES companies(id),

  -- Classification
  category_id     INT REFERENCES categories(id),
  tags            TEXT[],         -- denormalized for fast filtering

  -- Pricing
  pricing_model   TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'open-source', 'enterprise', 'usage-based')),
  has_free_tier   BOOLEAN DEFAULT FALSE,
  starting_price  NUMERIC(10,2),  -- lowest paid tier USD/mo
  pricing_url     TEXT,
  pricing_notes   TEXT,           -- e.g. "Free for 100 images/mo"

  -- Technical details
  has_api         BOOLEAN DEFAULT FALSE,
  api_docs_url    TEXT,
  is_open_source  BOOLEAN DEFAULT FALSE,
  github_url      TEXT,
  github_stars    INT,
  underlying_model TEXT,          -- 'GPT-4o', 'Claude 3.5', etc.
  model_provider  TEXT,           -- 'OpenAI', 'Anthropic', etc.

  -- Platform support
  platforms       TEXT[],         -- ['web', 'api', 'mobile-ios', 'mobile-android', 'desktop-mac', 'desktop-windows', 'vscode-extension', 'browser-extension']

  -- Derived/computed (updated by background jobs)
  avg_rating      NUMERIC(3,2) DEFAULT 0,
  review_count    INT DEFAULT 0,
  weekly_views    INT DEFAULT 0,
  weekly_growth   NUMERIC(5,2) DEFAULT 0, -- %
  monthly_saves   INT DEFAULT 0,

  -- Editorial
  is_featured     BOOLEAN DEFAULT FALSE,
  is_verified     BOOLEAN DEFAULT FALSE,   -- team has tested it
  editor_badge    TEXT,                    -- 'editors-pick', 'top-rated', 'trending', 'new'
  editor_notes    TEXT,
  
  -- Status
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'beta', 'deprecated', 'shutdown')),
  launched_at     DATE,
  last_checked_at TIMESTAMPTZ,

  -- SEO
  meta_title      TEXT,
  meta_description TEXT,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX idx_tools_fts ON tools USING GIN (
  to_tsvector('english', name || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(description, ''))
);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_pricing ON tools(pricing_model);
CREATE INDEX idx_tools_rating ON tools(avg_rating DESC);
CREATE INDEX idx_tools_featured ON tools(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX idx_tools_slug ON tools(slug);

-- ================================================================
-- TOOL REVIEWS
-- ================================================================

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id     UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ratings (1-5)
  rating_overall    SMALLINT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_ease       SMALLINT CHECK (rating_ease BETWEEN 1 AND 5),
  rating_value      SMALLINT CHECK (rating_value BETWEEN 1 AND 5),
  rating_features   SMALLINT CHECK (rating_features BETWEEN 1 AND 5),
  rating_support    SMALLINT CHECK (rating_support BETWEEN 1 AND 5),

  title       TEXT,
  body        TEXT NOT NULL,
  use_case    TEXT,             -- 'email writing', 'coding', 'image editing'
  pros        TEXT[],
  cons        TEXT[],
  
  -- Verification
  is_verified_user BOOLEAN DEFAULT FALSE,  -- actually uses the tool
  upvotes     INT DEFAULT 0,
  downvotes   INT DEFAULT 0,
  
  status      TEXT DEFAULT 'published' CHECK (status IN ('published', 'pending', 'rejected', 'flagged')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tool_id, user_id)
);

CREATE INDEX idx_reviews_tool ON reviews(tool_id, status);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ================================================================
-- LLM MODELS  (separate from tools — foundational models)
-- ================================================================

CREATE TABLE llm_models (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  version         TEXT,
  company_id      INT REFERENCES companies(id),
  
  -- Capabilities
  modalities      TEXT[],     -- ['text', 'image', 'audio', 'video', 'code']
  context_window  INT,        -- tokens
  max_output      INT,        -- tokens
  training_cutoff DATE,
  
  -- Benchmarks (updated via data pipeline)
  benchmark_mmlu          NUMERIC(5,2),
  benchmark_humaneval     NUMERIC(5,2),
  benchmark_gsm8k         NUMERIC(5,2),
  benchmark_hellaswag     NUMERIC(5,2),
  benchmark_arc           NUMERIC(5,2),
  lmsys_arena_score       INT,
  lmsys_arena_rank        INT,
  
  -- Pricing (per 1M tokens)
  price_input_per_1m      NUMERIC(10,4),
  price_output_per_1m     NUMERIC(10,4),
  price_notes             TEXT,
  
  -- Access
  is_open_source          BOOLEAN DEFAULT FALSE,
  license                 TEXT,
  api_provider            TEXT,   -- 'openai', 'anthropic', 'google', 'huggingface'
  model_string            TEXT,   -- exact API string: 'gpt-4o', 'claude-3-5-sonnet-20241022'
  api_docs_url            TEXT,
  
  -- Status
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'deprecated', 'preview', 'research')),
  released_at     DATE,
  deprecated_at   DATE,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Benchmark history (for tracking over time)
CREATE TABLE model_benchmark_history (
  id          BIGSERIAL PRIMARY KEY,
  model_id    INT NOT NULL REFERENCES llm_models(id),
  benchmark   TEXT NOT NULL,   -- 'mmlu', 'humaneval', 'arena_score'
  score       NUMERIC(10,4),
  source_url  TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- AI PLATFORMS / INFRASTRUCTURE
-- ================================================================

CREATE TABLE platforms (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  website_url     TEXT,
  platform_type   TEXT CHECK (platform_type IN ('cloud-api', 'marketplace', 'runtime', 'fine-tuning', 'vector-db', 'mlops', 'compute')),
  
  -- e.g. 'Hugging Face', 'Replicate', 'Groq', 'AWS Bedrock'
  supported_models TEXT[],
  pricing_model    TEXT,
  has_free_tier    BOOLEAN DEFAULT FALSE,
  
  avg_rating      NUMERIC(3,2),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- NEWS
-- ================================================================

CREATE TABLE news_sources (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  url       TEXT NOT NULL,
  rss_url   TEXT,
  logo_url  TEXT,
  credibility_score SMALLINT DEFAULT 5 CHECK (credibility_score BETWEEN 1 AND 10),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE news_articles (
  id            BIGSERIAL PRIMARY KEY,
  source_id     INT REFERENCES news_sources(id),
  external_url  TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  summary       TEXT,
  content       TEXT,
  image_url     TEXT,
  
  -- Classification (AI-tagged)
  category      TEXT CHECK (category IN ('model-release', 'funding', 'research', 'open-source', 'regulation', 'product-launch', 'acquisition', 'milestone', 'tutorial', 'opinion')),
  related_tools UUID[],         -- tool ids mentioned
  related_models INT[],         -- model ids mentioned
  tags          TEXT[],
  
  -- Engagement
  view_count    INT DEFAULT 0,
  save_count    INT DEFAULT 0,
  is_hot        BOOLEAN DEFAULT FALSE,
  is_featured   BOOLEAN DEFAULT FALSE,
  
  published_at  TIMESTAMPTZ,
  scraped_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_hot ON news_articles(is_hot) WHERE is_hot = TRUE;
CREATE INDEX idx_news_fts ON news_articles USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(summary, ''))
);

-- ================================================================
-- VIDEOS
-- ================================================================

CREATE TABLE youtube_channels (
  id              SERIAL PRIMARY KEY,
  channel_id      TEXT UNIQUE NOT NULL,   -- YouTube channel ID
  name            TEXT NOT NULL,
  handle          TEXT,
  description     TEXT,
  avatar_url      TEXT,
  subscriber_count BIGINT,
  focus_area      TEXT,    -- 'productivity', 'creative', 'developer', 'research'
  is_featured     BOOLEAN DEFAULT FALSE,
  last_synced_at  TIMESTAMPTZ
);

CREATE TABLE videos (
  id              BIGSERIAL PRIMARY KEY,
  youtube_id      TEXT UNIQUE NOT NULL,
  channel_id      INT REFERENCES youtube_channels(id),
  title           TEXT NOT NULL,
  description     TEXT,
  thumbnail_url   TEXT,
  duration_seconds INT,
  
  -- Classification
  category        TEXT,
  related_tools   UUID[],
  related_models  INT[],
  tags            TEXT[],
  difficulty      TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  
  -- Stats (synced from YouTube API)
  view_count      BIGINT DEFAULT 0,
  like_count      BIGINT DEFAULT 0,
  
  is_featured     BOOLEAN DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  last_synced_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_published ON videos(published_at DESC);
CREATE INDEX idx_videos_views ON videos(view_count DESC);
CREATE INDEX idx_videos_category ON videos(category);

-- ================================================================
-- USER ACTIVITY & PERSONALIZATION
-- ================================================================

-- Saved tools
CREATE TABLE user_saved_tools (
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_id     UUID REFERENCES tools(id) ON DELETE CASCADE,
  saved_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tool_id)
);

-- Tool views (for trending calculation)
CREATE TABLE tool_views (
  id          BIGSERIAL PRIMARY KEY,
  tool_id     UUID NOT NULL REFERENCES tools(id),
  user_id     UUID REFERENCES users(id),
  session_id  TEXT,
  viewed_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tool_views_recent ON tool_views(tool_id, viewed_at);

-- Comparison sessions
CREATE TABLE comparison_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id),
  tool_ids    UUID[] NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscriptions
CREATE TABLE email_subscriptions (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  user_id     UUID REFERENCES users(id),
  type        TEXT CHECK (type IN ('daily-digest', 'weekly-roundup', 'tool-alerts', 'funding-news')),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, type)
);

-- ================================================================
-- TOOL SUBMISSIONS (community-submitted tools)
-- ================================================================

CREATE TABLE tool_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitted_by    UUID REFERENCES users(id),
  name            TEXT NOT NULL,
  website_url     TEXT NOT NULL,
  description     TEXT,
  category_slug   TEXT,
  pricing_model   TEXT,
  has_api         BOOLEAN,
  is_open_source  BOOLEAN,
  submitter_email TEXT,
  submitter_note  TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'duplicate')),
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- WEEKLY SNAPSHOTS (for trend calculation)
-- ================================================================

CREATE TABLE tool_weekly_stats (
  tool_id       UUID REFERENCES tools(id),
  week_start    DATE NOT NULL,
  view_count    INT DEFAULT 0,
  save_count    INT DEFAULT 0,
  review_count  INT DEFAULT 0,
  avg_rating    NUMERIC(3,2),
  PRIMARY KEY (tool_id, week_start)
);

-- ================================================================
-- SEARCH ANALYTICS
-- ================================================================

CREATE TABLE search_events (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  session_id  TEXT,
  query       TEXT NOT NULL,
  filters     JSONB,
  result_count INT,
  clicked_tool_id UUID REFERENCES tools(id),
  searched_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_search_query ON search_events USING GIN (to_tsvector('english', query));

-- ================================================================
-- HELPFUL VIEWS
-- ================================================================

-- Top tools by category
CREATE VIEW v_top_tools_by_category AS
SELECT 
  c.slug as category_slug,
  c.name as category_name,
  t.id, t.slug, t.name, t.tagline, t.logo_url,
  t.avg_rating, t.review_count, t.pricing_model, t.weekly_growth,
  t.editor_badge, t.is_featured,
  ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY t.avg_rating DESC, t.review_count DESC) as rank
FROM tools t
JOIN categories c ON t.category_id = c.id
WHERE t.status = 'active';

-- Trending tools this week
CREATE VIEW v_trending_tools AS
SELECT 
  t.id, t.slug, t.name, t.tagline, t.logo_url, t.pricing_model,
  t.avg_rating, t.review_count,
  COALESCE(SUM(tv.view_count), 0) as weekly_views,
  t.weekly_growth
FROM tools t
LEFT JOIN tool_weekly_stats tv ON t.id = tv.tool_id 
  AND tv.week_start = DATE_TRUNC('week', NOW())::DATE
WHERE t.status = 'active'
GROUP BY t.id
ORDER BY weekly_growth DESC NULLS LAST, weekly_views DESC;

-- Model leaderboard
CREATE VIEW v_model_leaderboard AS
SELECT 
  m.id, m.slug, m.name, m.version,
  c.name as company_name,
  m.context_window, m.modalities,
  m.benchmark_mmlu, m.benchmark_humaneval, m.lmsys_arena_score,
  m.price_input_per_1m, m.price_output_per_1m, m.is_open_source,
  m.released_at, m.model_string
FROM llm_models m
JOIN companies c ON m.company_id = c.id
WHERE m.status = 'active'
ORDER BY m.lmsys_arena_score DESC NULLS LAST;

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Full-text + fuzzy search for tools
CREATE OR REPLACE FUNCTION search_tools(
  query_text TEXT,
  category_filter TEXT DEFAULT NULL,
  pricing_filter TEXT DEFAULT NULL,
  api_only BOOLEAN DEFAULT FALSE,
  opensource_only BOOLEAN DEFAULT FALSE,
  limit_n INT DEFAULT 20,
  offset_n INT DEFAULT 0
)
RETURNS TABLE (
  id UUID, slug TEXT, name TEXT, tagline TEXT, logo_url TEXT,
  avg_rating NUMERIC, review_count INT, pricing_model TEXT,
  category_slug TEXT, weekly_growth NUMERIC, rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id, t.slug, t.name, t.tagline, t.logo_url,
    t.avg_rating, t.review_count, t.pricing_model,
    cat.slug as category_slug, t.weekly_growth,
    ts_rank(
      to_tsvector('english', t.name || ' ' || COALESCE(t.tagline,'') || ' ' || COALESCE(t.description,'')),
      plainto_tsquery('english', query_text)
    ) AS rank
  FROM tools t
  JOIN categories cat ON t.category_id = cat.id
  WHERE 
    t.status = 'active'
    AND (query_text IS NULL OR query_text = '' OR 
      to_tsvector('english', t.name || ' ' || COALESCE(t.tagline,'') || ' ' || COALESCE(t.description,''))
      @@ plainto_tsquery('english', query_text))
    AND (category_filter IS NULL OR cat.slug = category_filter)
    AND (pricing_filter IS NULL OR t.pricing_model = pricing_filter)
    AND (NOT api_only OR t.has_api = TRUE)
    AND (NOT opensource_only OR t.is_open_source = TRUE)
  ORDER BY rank DESC, t.avg_rating DESC, t.review_count DESC
  LIMIT limit_n OFFSET offset_n;
END;
$$ LANGUAGE plpgsql;

-- Recalculate tool average rating (called by trigger)
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tools SET
    avg_rating = (SELECT ROUND(AVG(rating_overall)::NUMERIC, 2) FROM reviews WHERE tool_id = NEW.tool_id AND status = 'published'),
    review_count = (SELECT COUNT(*) FROM reviews WHERE tool_id = NEW.tool_id AND status = 'published'),
    updated_at = NOW()
  WHERE id = NEW.tool_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tool_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_tool_rating();

-- ================================================================
-- SAMPLE SEED DATA
-- ================================================================

INSERT INTO categories (slug, name, description, icon, sort_order) VALUES
  ('llm-chat', 'LLM Chat', 'Conversational AI assistants and chatbots', '💬', 1),
  ('image-generation', 'Image Generation', 'AI tools for creating and editing images', '🎨', 2),
  ('code-assistant', 'Code Assistant', 'AI-powered coding tools and IDEs', '⚡', 3),
  ('video-generation', 'Video Generation', 'AI video creation and editing', '🎬', 4),
  ('audio-ai', 'Audio AI', 'Voice synthesis, music generation, audio tools', '🎙️', 5),
  ('ai-search', 'AI Search', 'AI-powered search and research tools', '🔍', 6),
  ('local-ai', 'Local AI', 'Run AI models locally on your own hardware', '🦙', 7),
  ('writing', 'Writing & Editing', 'AI writing assistants and editors', '✍️', 8),
  ('automation', 'Automation', 'AI workflow and task automation', '⚙️', 9),
  ('data-analytics', 'Data & Analytics', 'AI for data analysis and visualization', '📊', 10);

INSERT INTO companies (slug, name, website, hq_country, founded_year) VALUES
  ('openai', 'OpenAI', 'https://openai.com', 'US', 2015),
  ('anthropic', 'Anthropic', 'https://anthropic.com', 'US', 2021),
  ('google-deepmind', 'Google DeepMind', 'https://deepmind.google', 'US', 2010),
  ('meta-ai', 'Meta AI', 'https://ai.meta.com', 'US', 2013),
  ('mistral-ai', 'Mistral AI', 'https://mistral.ai', 'FR', 2023),
  ('midjourney', 'Midjourney', 'https://midjourney.com', 'US', 2021),
  ('elevenlabs', 'ElevenLabs', 'https://elevenlabs.io', 'US', 2022),
  ('runway', 'Runway', 'https://runwayml.com', 'US', 2018);
