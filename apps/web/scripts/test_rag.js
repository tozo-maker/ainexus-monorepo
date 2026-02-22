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
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function testRAG(message) {
    try {
        console.log(`\nUser Question: "${message}"`);

        // 1. Generate embedding
        console.log("1. Generating embedding...");
        const embeddingResult = await embeddingModel.embedContent(message);
        const vector = embeddingResult.embedding.values;
        console.log("   - Embedding generated.");

        // 2. Retrieve context
        console.log("2. Querying database...");
        const vectorStr = `[${vector.join(',')}]`;
        const searchResult = await pool.query(
            `SELECT t.name, t.description, c.name as category, t.pricing_model, t.avg_rating 
           FROM tools t
           LEFT JOIN categories c ON t.category_id = c.id
           ORDER BY t.embedding <=> $1 ASC 
           LIMIT 5`,
            [vectorStr]
        );
        console.log(`   - Found ${searchResult.rows.length} relevant tools.`);

        const contextTools = searchResult.rows.map(tool =>
            `- ${tool.name} (Category: ${tool.category}): ${tool.description}`
        ).join("\n");

        // 3. Generate Answer
        console.log("3. Generating answer with Gemini Pro...");
        const prompt = `
        You are an AI assistant. Answer based on this context:
        ${contextTools}

        Question: "${message}"
        `;

        const result = await chatModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\nModel Response:");
        console.log(text);

    } catch (error) {
        console.error("\n❌ RAG FAILED:", error);
    } finally {
        pool.end();
    }
}

testRAG("Compare ChatGPT and Claude");
