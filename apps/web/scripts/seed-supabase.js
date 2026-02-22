const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TOOLS = [
    { slug: 'chatgpt', name: "ChatGPT", category: "llm-chat", tags: ["chat", "writing", "code"], price: "freemium", rating: 4.8, reviews: 6173, model: "GPT-4o", company: "openai", badge: "Most Popular", description: "The industry-leading conversational AI for research, writing, coding, and automation.", weekly: 12, featured: true, logo: "🤖", api: true, opensource: false, url: "https://chat.openai.com" },
    { slug: 'claude', name: "Claude", category: "llm-chat", tags: ["chat", "analysis", "code"], price: "freemium", rating: 4.9, reviews: 4820, model: "Claude 3.5", company: "anthropic", badge: "Editor's Pick", description: "Exceptional reasoning, analysis, and long-context understanding with a strong safety focus.", weekly: 8, featured: true, logo: "✦", api: true, opensource: false, url: "https://claude.ai" },
    { slug: 'midjourney', name: "Midjourney", category: "image-generation", tags: ["image", "art", "design"], price: "paid", rating: 4.7, reviews: 3811, model: "MJ v6", company: "midjourney", badge: "Top Rated", description: "The gold standard for AI art generation. Stunning aesthetics and photorealism.", weekly: 5, featured: true, logo: "🎨", api: false, opensource: false, url: "https://midjourney.com" },
    { slug: 'cursor', name: "Cursor", category: "code-assistant", tags: ["code", "IDE", "productivity"], price: "freemium", rating: 4.9, reviews: 2940, model: "GPT-4 / Claude", company: "openai", badge: "🔥 Trending", description: "AI-first code editor that understands your entire codebase and writes code with you.", weekly: 34, featured: true, logo: "⚡", api: false, opensource: false, url: "https://cursor.sh" },
    { slug: 'ollama', name: "Ollama", category: "local-ai", tags: ["local", "open-source", "LLM"], price: "free", rating: 4.7, reviews: 2100, model: "Various", company: "openai", badge: "Open Source", description: "Run powerful LLMs locally on your machine. Full privacy, no internet required.", weekly: 41, featured: false, logo: "🦙", api: true, opensource: true, url: "https://ollama.ai" },
];

async function seed() {
    console.log("Fetching categories and companies...");
    const { data: cats } = await supabase.from('categories').select('id, slug');
    const { data: comps } = await supabase.from('companies').select('id, slug');

    const catMap = {};
    cats.forEach(c => catMap[c.slug] = c.id);
    const compMap = {};
    comps.forEach(c => compMap[c.slug] = c.id);

    console.log("Seeding tools...");
    for (const tool of TOOLS) {
        const catId = catMap[tool.category];
        const compId = compMap[tool.company];

        if (!catId || !compId) {
            console.log("Skipping", tool.name, "due to missing cat/comp");
            continue;
        }

        const { error } = await supabase.from('tools').upsert({
            slug: tool.slug,
            name: tool.name,
            description: tool.description,
            website_url: tool.url,
            category_id: catId,
            company_id: compId,
            tags: tool.tags,
            pricing_model: tool.price,
            avg_rating: tool.rating,
            review_count: tool.reviews,
            is_featured: tool.featured,
            editor_badge: tool.badge,
            logo_url: tool.logo,
            has_api: tool.api,
            is_open_source: tool.opensource,
            weekly_growth: tool.weekly
        }, { onConflict: 'slug' });

        if (error) console.error("Error inserting tool:", tool.name, error.message);
        else console.log("Inserted tool:", tool.name);
    }
    console.log("Seeding complete.");
}

seed();
