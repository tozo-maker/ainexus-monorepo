const { Pool } = require('pg');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const CORE_CATEGORIES = [
    "LLM Chat",
    "Image Generation",
    "Code Assistant",
    "Audio AI",
    "Video AI",
    "Writing",
    "Research",
    "Marketing",
    "Productivity",
    "Video Generation" // Mapping to Video AI in UI usually
];

async function consolidateCategories() {
    console.log("🛠️ Starting Category Consolidation...");

    const { rows: categories } = await pool.query('SELECT id, name FROM categories');
    console.log(`Analyzing ${categories.length} categories...`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    for (const cat of categories) {
        if (CORE_CATEGORIES.includes(cat.name)) continue;

        const prompt = `
            Map this AI tool category: "${cat.name}"
            To one of these core categories:
            ${CORE_CATEGORIES.join(", ")}

            Return ONLY the name of the core category. If no good match, return "Productivity".
        `;

        try {
            const result = await model.generateContent(prompt);
            const coreCatName = result.response.text().trim();

            console.log(` - Mapping "${cat.name}" -> "${coreCatName}"`);

            // Find or create core category
            let { rows: coreCat } = await pool.query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [coreCatName]);
            let coreCatId;
            if (coreCat.length === 0) {
                const slug = coreCatName.toLowerCase().replace(/ /g, '-');
                const insertRes = await pool.query(`
                    INSERT INTO categories (name, slug) 
                    VALUES ($1, $2) 
                    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
                    RETURNING id
                `, [coreCatName, slug]);
                coreCatId = insertRes.rows[0].id;
            } else {
                coreCatId = coreCat[0].id;
            }

            // Update all tools in the old category to the new core category
            await pool.query('UPDATE tools SET category_id = $1 WHERE category_id = $2', [coreCatId, cat.id]);

        } catch (e) {
            console.error(`Failed to map ${cat.name}:`, e.message);
        }
    }

    console.log("✅ Category consolidation complete.");
    await pool.end();
}

consolidateCategories();
