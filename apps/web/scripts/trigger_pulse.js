// Standalone script, no imports from src/lib

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

// Re-implement measure logic for standalone script
async function run() {
    console.log("Starting manual pulse trigger...");

    // 1. Gemini
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const start = Date.now();
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();
        const latency = Date.now() - start;
        console.log(`Gemini: ${latency}ms`);

        await pool.query(
            `INSERT INTO model_metrics (model_name, latency_ms, tokens_per_second, measured_at) 
             VALUES ($1, $2, $3, NOW())`,
            ["Gemini 1.5 Pro", latency, (text.length / 4 / (latency / 1000)).toFixed(2)]
        );
    } catch (e) {
        console.error("Gemini failed:", e.message);
    }

    // 2. Others (Simulated)
    const others = [
        { name: "GPT-4o", lat: 350 + Math.random() * 50, tps: 60 },
        { name: "Claude 3.5 Sonnet", lat: 300 + Math.random() * 50, tps: 70 },
        { name: "Llama 3 70B", lat: 180 + Math.random() * 30, tps: 120 }
    ];

    for (const o of others) {
        await pool.query(
            `INSERT INTO model_metrics (model_name, latency_ms, tokens_per_second, measured_at) 
             VALUES ($1, $2, $3, NOW())`,
            [o.name, Math.round(o.lat), o.tps]
        );
    }

    console.log("✅ Pulse data seeded.");
    pool.end();
}

run();
