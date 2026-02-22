
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
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function generateEmbedding(text) {
    try {
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (e) {
        console.error("Error generating embedding:", e);
        return null;
    }
}

async function embed() {
    try {
        console.log("Connecting to database...");
        // 1. Enable pgvector extension if not enabled
        await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
        console.log("Vector extension enabled.");

        // 2. Add embedding column if not exists
        // Gemini embedding-001 has 3072 dimensions not 768
        await pool.query('ALTER TABLE tools ADD COLUMN IF NOT EXISTS embedding vector(3072)');
        console.log("Embedding column ready.");

        // 3. Fetch tools without embeddings
        const res = await pool.query('SELECT id, name, description, tags, category_id FROM tools WHERE embedding IS NULL');
        const tools = res.rows;
        console.log(`Found ${tools.length} tools to embed.`);

        // 4. Loop and embed
        for (const tool of tools) {
            // Fetch category name for context
            const catRes = await pool.query('SELECT name FROM categories WHERE id = $1', [tool.category_id]);
            const category = catRes.rows[0]?.name || '';

            const textToEmbed = `${tool.name}: ${tool.description} Category: ${category} Tags: ${tool.tags ? tool.tags.join(', ') : ''}`;

            console.log(`Generating embedding for: ${tool.name}`);
            const vector = await generateEmbedding(textToEmbed);

            if (vector) {
                // pgvector format is a string like '[1,2,3]'
                const vectorStr = JSON.stringify(vector);
                await pool.query('UPDATE tools SET embedding = $1 WHERE id = $2', [vectorStr, tool.id]);
                console.log(`Saved embedding for ${tool.name}`);
            }

            // Rate limit prevention (Gemini free tier is generous but good practice)
            await new Promise(r => setTimeout(r, 500));
        }

        console.log("Embedding complete.");

    } catch (e) {
        console.error("Embedding failed:", e);
    } finally {
        pool.end();
    }
}

embed();
