const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

async function migrate() {
    console.log("Starting Phase 4 Database Migration...");

    try {
        // Add Social & Analytics columns to tools table
        await pool.query(`
            ALTER TABLE tools 
            ADD COLUMN IF NOT EXISTS twitter_url TEXT,
            ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
            ADD COLUMN IF NOT EXISTS github_url TEXT,
            ADD COLUMN IF NOT EXISTS discord_url TEXT,
            ADD COLUMN IF NOT EXISTS market_share DECIMAL(5,2),
            ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(5,2),
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS last_enriched_at TIMESTAMP WITH TIME ZONE;
        `);

        // Add index for popularity sorting
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_tools_popularity ON tools(popularity_score DESC);
        `);

        console.log("✅ Database schema updated successfully.");

    } catch (e) {
        console.error("❌ Migration failed:", e.message);
    } finally {
        await pool.end();
    }
}

migrate();
