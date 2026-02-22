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

async function testSearch(queryText) {
    try {
        console.log(`Generating embedding for query: "${queryText}"...`);
        const result = await model.embedContent(queryText);
        const embedding = result.embedding.values;
        console.log(`Generated embedding with ${embedding.length} dimensions.`);

        console.log("Querying database for nearest neighbors...");
        const vectorStr = `[${embedding.join(',')}]`;
        const res = await pool.query(
            `SELECT t.name, t.description, c.name as category, 1 - (t.embedding <=> $1) as similarity 
             FROM tools t
             LEFT JOIN categories c ON t.category_id = c.id
             ORDER BY t.embedding <=> $1 ASC 
             LIMIT 5`,
            [vectorStr]
        );

        console.log("\nTop 5 Results:");
        res.rows.forEach((row, i) => {
            console.log(`${i + 1}. ${row.name} (${row.category}) - Similarity: ${row.similarity.toFixed(4)}`);
            console.log(`   ${row.description.substring(0, 100)}...`);
        });

    } catch (e) {
        console.error("Search failed:", e);
    } finally {
        pool.end();
    }
}

const query = process.argv[2] || "help me write python code";
testSearch(query);
