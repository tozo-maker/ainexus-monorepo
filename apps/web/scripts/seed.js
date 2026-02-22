
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

const SCHEMA_PATH = path.join(__dirname, '../../example/schema.sql');

// DATA EXTRACTED FROM ai-nexus-platform.jsx
const TOOLS = [
    { id: 'uuid-1', slug: 'chatgpt', name: "ChatGPT", category: "LLM Chat", tags: ["chat", "writing", "code"], price: "Freemium", rating: 4.8, reviews: 6173, model: "GPT-4o", company: "OpenAI", badge: "Most Popular", description: "The industry-leading conversational AI for research, writing, coding, and automation.", weekly: "+12%", featured: true, logo: "🤖", api: true, opensource: false, url: "https://chat.openai.com" },
    { id: 'uuid-2', slug: 'claude', name: "Claude", category: "LLM Chat", tags: ["chat", "analysis", "code"], price: "Freemium", rating: 4.9, reviews: 4820, model: "Claude 3.5", company: "Anthropic", badge: "Editor's Pick", description: "Exceptional reasoning, analysis, and long-context understanding with a strong safety focus.", weekly: "+8%", featured: true, logo: "✦", api: true, opensource: false, url: "https://claude.ai" },
    { id: 'uuid-3', slug: 'midjourney', name: "Midjourney", category: "Image Generation", tags: ["image", "art", "design"], price: "Paid", rating: 4.7, reviews: 3811, model: "MJ v6", company: "Midjourney", badge: "Top Rated", description: "The gold standard for AI art generation. Stunning aesthetics and photorealism.", weekly: "+5%", featured: true, logo: "🎨", api: false, opensource: false, url: "https://midjourney.com" },
    { id: 'uuid-4', slug: 'cursor', name: "Cursor", category: "Code Assistant", tags: ["code", "IDE", "productivity"], price: "Freemium", rating: 4.9, reviews: 2940, model: "GPT-4 / Claude", company: "Anysphere", badge: "🔥 Trending", description: "AI-first code editor that understands your entire codebase and writes code with you.", weekly: "+34%", featured: true, logo: "⚡", api: false, opensource: false, url: "https://cursor.sh" },
    { id: 'uuid-5', slug: 'perplexity', name: "Perplexity", category: "AI Search", tags: ["search", "research", "chat"], price: "Freemium", rating: 4.6, reviews: 1247, model: "Multiple", company: "Perplexity AI", badge: null, description: "Real-time AI search engine that cites its sources and answers complex questions.", weekly: "+18%", featured: false, logo: "🔍", api: true, opensource: false, url: "https://perplexity.ai" },
    { id: 'uuid-6', slug: 'elevenlabs', name: "ElevenLabs", category: "Audio AI", tags: ["voice", "audio", "TTS"], price: "Freemium", rating: 4.8, reviews: 980, model: "EL v2", company: "ElevenLabs", badge: "🔥 Trending", description: "Most realistic AI voice synthesis. Clone voices, generate speech in 30 languages.", weekly: "+22%", featured: false, logo: "🎙️", api: true, opensource: false, url: "https://elevenlabs.io" },
    { id: 'uuid-7', slug: 'runway', name: "Runway", category: "Video Generation", tags: ["video", "creative", "generation"], price: "Freemium", rating: 4.5, reviews: 876, model: "Gen-3", company: "Runway", badge: null, description: "Professional-grade AI video generation and editing for filmmakers and creators.", weekly: "+15%", featured: false, logo: "🎬", api: true, opensource: false, url: "https://runwayml.com" },
    { id: 'uuid-8', slug: 'ollama', name: "Ollama", category: "Local AI", tags: ["local", "open-source", "LLM"], price: "Free", rating: 4.7, reviews: 2100, model: "Various", company: "Ollama", badge: "Open Source", description: "Run powerful LLMs locally on your machine. Full privacy, no internet required.", weekly: "+41%", featured: false, logo: "🦙", api: true, opensource: true, url: "https://ollama.ai" },
    { id: 'uuid-9', slug: 'suno', name: "Suno", category: "Audio AI", tags: ["music", "audio", "generation"], price: "Freemium", rating: 4.6, reviews: 1560, model: "v4", company: "Suno", badge: "🔥 Trending", description: "Create full songs from text prompts. Lyrics, vocals, and instrumentation in seconds.", weekly: "+29%", featured: false, logo: "🎵", api: false, opensource: false, url: "https://suno.ai" },
    { id: 'uuid-10', slug: 'replit', name: "Replit", category: "Code Assistant", tags: ["code", "cloud", "deployment"], price: "Freemium", rating: 4.4, reviews: 1890, model: "GPT-4", company: "Replit", badge: null, description: "AI-powered collaborative coding environment with instant deployment.", weekly: "+7%", featured: false, logo: "🔁", api: true, opensource: false, url: "https://replit.com" },
    { id: 'uuid-11', slug: 'stable-diffusion', name: "Stable Diffusion", category: "Image Generation", tags: ["image", "open-source", "local"], price: "Free", rating: 4.5, reviews: 4200, model: "SDXL / SD3", company: "Stability AI", badge: "Open Source", description: "The most powerful open-source image generation model. Fully customizable.", weekly: "+3%", featured: false, logo: "🌀", api: true, opensource: true, url: "https://stability.ai" },
    { id: 'uuid-12', slug: 'kling-ai', name: "Kling AI", category: "Video Generation", tags: ["video", "generation", "realistic"], price: "Freemium", rating: 4.7, reviews: 620, model: "Kling 1.5", company: "Kuaishou", badge: "New", description: "Hyper-realistic video generation with excellent motion coherence and physics.", weekly: "+67%", featured: false, logo: "🎥", api: false, opensource: false, url: "https://kling.ai" },
];

const MODELS = [
    { id: 1, slug: 'gpt-4o', name: "GPT-4o", company: "OpenAI", context: "128K", mmlu: 88.7, humaneval: 90.2, arena: 1310, price_in: 2.50, price_out: 10.00, opensource: false, multimodal: true, release: "May 2024" },
    { id: 2, slug: 'claude-3-5-sonnet', name: "Claude 3.5 Sonnet", company: "Anthropic", context: "200K", mmlu: 88.3, humaneval: 92.0, arena: 1268, price_in: 3.00, price_out: 15.00, opensource: false, multimodal: true, release: "Oct 2024" },
    { id: 3, slug: 'gemini-1-5-pro', name: "Gemini 1.5 Pro", company: "Google", context: "1M", mmlu: 85.9, humaneval: 84.1, arena: 1220, price_in: 3.50, price_out: 10.50, opensource: false, multimodal: true, release: "Apr 2024" },
    { id: 4, slug: 'llama-3-1-405b', name: "Llama 3.1 405B", company: "Meta", context: "128K", mmlu: 88.6, humaneval: 89.0, arena: 1170, price_in: 0.00, price_out: 0.00, opensource: true, multimodal: false, release: "Jul 2024" },
    { id: 5, slug: 'grok-2', name: "Grok 2", company: "xAI", context: "128K", mmlu: 87.5, humaneval: 88.4, arena: 1240, price_in: 2.00, price_out: 10.00, opensource: false, multimodal: true, release: "Aug 2024" },
    { id: 6, slug: 'mistral-large-2', name: "Mistral Large 2", company: "Mistral", context: "128K", mmlu: 84.0, humaneval: 92.1, arena: 1095, price_in: 2.00, price_out: 6.00, opensource: false, multimodal: false, release: "Jul 2024" },

];

const NEWS = [
    { id: 1, title: "OpenAI Releases GPT-4.5 Turbo with 2x Speed Improvement", source: "TechCrunch", time: "2h ago", category: "Model Release", hot: true, img: "🤖", url: "https://techcrunch.com" },
    { id: 2, title: "Anthropic Raises $4B Series D at $60B Valuation", source: "Bloomberg", time: "5h ago", category: "Funding", hot: true, img: "💰", url: "https://bloomberg.com" },
    { id: 3, title: "Google DeepMind Publishes Gemini Ultra 2 Benchmark Results", source: "DeepMind Blog", time: "8h ago", category: "Research", hot: false, img: "📊", url: "https://deepmind.google/blog" },
    { id: 4, title: "Cursor Hits 1M Daily Active Developers", source: "VentureBeat", time: "12h ago", category: "Milestone", hot: false, img: "⚡", url: "https://venturebeat.com" },
    { id: 5, title: "Meta Open-Sources Llama 3.2 with Vision Capabilities", source: "The Verge", time: "1d ago", category: "Open Source", hot: true, img: "🦙", url: "https://theverge.com" },
    { id: 6, title: "EU AI Act Compliance Deadline Approaching: What Tools Are Affected?", source: "Wired", time: "1d ago", category: "Regulation", hot: false, img: "⚖️", url: "https://wired.com" },
];

const VIDEOS = [
    { id: 1, title: "I Tested Every AI Coding Tool — Here's the Winner", channel: "Fireship", views: "2.4M", time: "3d ago", category: "Code", thumb: "⚡", youtube_id: "vid1" },
    { id: 2, title: "GPT-4o vs Claude 3.5 vs Gemini: The ULTIMATE Comparison", channel: "AI Explained", views: "1.8M", time: "1w ago", category: "Comparison", thumb: "🔬", youtube_id: "vid2" },
    { id: 3, title: "Building an AI Agent in 15 Minutes with LangChain", channel: "Matt Wolfe", views: "890K", time: "5d ago", category: "Tutorial", thumb: "🤖", youtube_id: "vid3" },
    { id: 4, title: "Midjourney v7 First Look: Insane Quality Upgrade", channel: "Two Minute Papers", views: "1.2M", time: "2d ago", category: "Image AI", thumb: "🎨", youtube_id: "vid4" },
    { id: 5, title: "The Real Cost of AI APIs in 2025 — Full Breakdown", channel: "AI Jason", views: "445K", time: "1w ago", category: "Pricing", thumb: "💸", youtube_id: "vid5" },
    { id: 6, title: "Local LLMs Are Now BETTER Than GPT-4 (Here's How)", channel: "Theo", views: "1.1M", time: "4d ago", category: "Local AI", thumb: "🦙", youtube_id: "vid6" },
];


// NOTE: Companies and Categories need to be properly linked.
// For simplicity, we will query existing categories/companies or insert them if missing.

async function seed() {
    try {
        console.log("Reading schema...");
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');

        console.log("Applying schema...");
        try {
            await pool.query(schema);
            console.log("Schema applied.");
        } catch (err) {
            if (err.code === '42P07') {
                console.log("Schema already exists (relation already exists). Skipping schema creation.");
            } else {
                throw err;
            }
        }

        console.log("Seeding data...");

        // Seed Categories (Schema handles duplicates via UNIQUE, but we might need ON CONFLICT DO NOTHING)
        // The Schema already has INSERT statements for categories/companies at the end.
        // However, the component data might have slightly different names.
        // Let's rely on schema initial data for basic categories.

        // Seed Tools
        // We need to fetch category IDs first.
        const catsRes = await pool.query('SELECT id, name FROM categories');
        const cats = {};
        catsRes.rows.forEach(c => cats[c.name] = c.id);

        // Seed Companies similarly if needed
        const compsRes = await pool.query('SELECT id, name FROM companies');
        const comps = {};
        compsRes.rows.forEach(c => comps[c.name] = c.id);

        for (const tool of TOOLS) {
            // Find category ID
            let catId = cats[tool.category];
            if (!catId) {
                // Fallback or insert? For now, if missing, skip or null.
                console.warn(`Category not found for tool ${tool.name}: ${tool.category}`);
            }

            // Find company ID
            let compId = comps[tool.company];
            if (!compId) {
                // Insert company if missing
                const res = await pool.query('INSERT INTO companies (slug, name, website) VALUES ($1, $2, $3) RETURNING id',
                    [tool.company.toLowerCase().replace(/ /g, '-'), tool.company, '']);
                compId = res.rows[0].id;
                comps[tool.company] = compId;
            }

            // Check if tool exists
            const existing = await pool.query('SELECT id FROM tools WHERE slug = $1', [tool.slug]);
            if (existing.rows.length === 0) {
                await pool.query(`
          INSERT INTO tools (
            slug, name, description, website_url, category_id, company_id, tags, 
            pricing_model, avg_rating, review_count, is_featured, editor_badge,
            logo_url, has_api, is_open_source, weekly_growth
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
                    tool.slug,
                    tool.name,
                    tool.description,
                    tool.url,
                    catId,
                    compId,
                    tool.tags,
                    tool.price.toLowerCase(), // 'freemium', 'paid', 'free' -> matches schema constraint? Schema says: 'free', 'freemium', 'paid', 'open-source', 'enterprise', 'usage-based'
                    tool.rating,
                    tool.reviews,
                    tool.featured,
                    tool.badge,
                    tool.logo,
                    tool.api,
                    tool.opensource,
                    parseFloat(tool.weekly.replace('%', '').replace('+', ''))
                ]);
                console.log(`Inserted tool: ${tool.name}`);
            }
        }

        // Seed Models
        // Similar logic for models
        for (const model of MODELS) {
            let compId = comps[model.company];
            if (!compId) {
                // Should exist from tools seeding, but just in case
                const res = await pool.query('INSERT INTO companies (slug, name, website) VALUES ($1, $2, $3) RETURNING id',
                    [model.company.toLowerCase().replace(/ /g, '-'), model.company, '']);
                compId = res.rows[0].id;
                comps[model.company] = compId;
            }

            const existing = await pool.query('SELECT id FROM llm_models WHERE slug = $1', [model.slug]);
            if (existing.rows.length === 0) {
                // Check constraints: status, etc.
                await pool.query(`
           INSERT INTO llm_models (
             slug, name, company_id, context_window, benchmark_mmlu, benchmark_humaneval, 
             lmsys_arena_score, price_input_per_1m, price_output_per_1m, 
             is_open_source, released_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         `, [
                    model.slug,
                    model.name,
                    compId,
                    parseInt(model.context.replace('K', '000').replace('M', '000000')), // approximate parsing
                    model.mmlu,
                    model.humaneval,
                    model.arena,
                    model.price_in,
                    model.price_out,
                    model.opensource
                ]);
                console.log(`Inserted model: ${model.name}`);
            }
        }

        // Seed News Sources and Articles
        for (const item of NEWS) {
            // Check if source exists
            let sourceId;
            const sourceRes = await pool.query('SELECT id FROM news_sources WHERE name = $1', [item.source]);
            if (sourceRes.rows.length > 0) {
                sourceId = sourceRes.rows[0].id;
            } else {
                const res = await pool.query('INSERT INTO news_sources (name, url) VALUES ($1, $2) RETURNING id', [item.source, 'https://example.com']);
                sourceId = res.rows[0].id;
            }

            // Insert Article
            const existing = await pool.query('SELECT id FROM news_articles WHERE title = $1', [item.title]);
            if (existing.rows.length === 0) {
                // We need to handle the 'category' enum constraint.
                // Schema: 'model-release', 'funding', 'research', 'open-source', 'regulation', 'product-launch', 'acquisition', 'milestone', 'tutorial', 'opinion'
                // Data categories: "Model Release", "Funding", "Research", "Open Source", "Regulation", "Milestone"
                // Need to map them to slug format.
                const catMap = {
                    "Model Release": "model-release",
                    "Funding": "funding",
                    "Research": "research",
                    "Open Source": "open-source",
                    "Regulation": "regulation",
                    "Milestone": "milestone"
                };

                await pool.query(`
                      INSERT INTO news_articles (source_id, external_url, title, category, is_hot, published_at)
                      VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '1 day')
                  `, [
                    sourceId,
                    item.url + '/' + item.id,
                    item.title,
                    catMap[item.category] || 'opinion',
                    item.hot
                ]);
                console.log(`Inserted news: ${item.title}`);
            }
        }

        // Seed Videos and Channels
        for (const vid of VIDEOS) {
            let chanId;
            const chanRes = await pool.query('SELECT id FROM youtube_channels WHERE name = $1', [vid.channel]);
            if (chanRes.rows.length > 0) {
                chanId = chanRes.rows[0].id;
            } else {
                const res = await pool.query('INSERT INTO youtube_channels (name, channel_id) VALUES ($1, $2) RETURNING id', [vid.channel, 'ch_' + vid.channel]);
                chanId = res.rows[0].id;
            }

            const existing = await pool.query('SELECT id FROM videos WHERE youtube_id = $1', [vid.youtube_id]);
            if (existing.rows.length === 0) {
                await pool.query(`
                     INSERT INTO videos (youtube_id, channel_id, title, category, view_count, published_at)
                     VALUES ($1, $2, $3, $4, $5, NOW())
                 `, [
                    vid.youtube_id,
                    chanId,
                    vid.title,
                    vid.category, // Schema checks: no constraint on category text, just TEXT.
                    parseInt(vid.views.replace('M', '000000').replace('K', '000').replace('.', '')), // rough parsing
                ]);
                console.log(`Inserted video: ${vid.title}`);
            }

        }

        console.log("Seeding complete.");
    } catch (e) {
        console.error("Seeding failed:", e);
    } finally {
        pool.end();
    }
}

seed();
