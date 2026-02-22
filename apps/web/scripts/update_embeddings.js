const { Pool } = require('pg');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function embed() {
    try {
        console.log("Connecting to DB...");
        // 1. Get tools without embeddings
        const res = await pool.query("SELECT id, name, description, category_id, tags FROM tools WHERE embedding IS NULL");
        console.log(`Found ${res.rowCount} tools needing embeddings.`);

        for (const tool of res.rows) {
            console.log(`Generating embedding for: ${tool.name}`);

            // Get category name
            const catRes = await pool.query("SELECT name FROM categories WHERE id = $1", [tool.category_id]);
            const category = catRes.rows[0]?.name || "Uncategorized";

            const text = `${tool.name}: ${tool.description} Category: ${category} Tags: ${tool.tags.join(', ')}`;

            // Generate embedding
            const result = await model.embedContent(text);
            const embedding = result.embedding.values;

            // Update DB
            const vectorStr = `[${embedding.join(',')}]`; // pgvector format
            await pool.query("UPDATE tools SET embedding = $1 WHERE id = $2", [vectorStr, tool.id]);
        }

        console.log("Done!");
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

embed();
