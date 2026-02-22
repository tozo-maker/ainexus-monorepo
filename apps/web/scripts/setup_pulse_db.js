const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

async function setupPulseDB() {
    try {
        console.log("Creating model_metrics table...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS model_metrics (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                model_name VARCHAR(255) NOT NULL,
                latency_ms INTEGER NOT NULL,
                tokens_per_second DECIMAL(10, 2),
                measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Index for fast retrieval of latest metrics per model
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_model_metrics_name_time 
            ON model_metrics(model_name, measured_at DESC);
        `);

        console.log("✅ model_metrics table created successfully.");

    } catch (e) {
        console.error("❌ Error creating table:", e);
    } finally {
        pool.end();
    }
}

setupPulseDB();
