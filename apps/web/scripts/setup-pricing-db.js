require('dotenv').config({ path: ['.env.local', '.env'] });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

async function main() {
    console.log("Setting up Pricing Detection database tables...");

    try {
        // 1. Add website_content_hash to tools table to track changes
        console.log("Adding website_content_hash to tools table...");
        await pool.query(`
            ALTER TABLE tools 
            ADD COLUMN IF NOT EXISTS website_content_hash TEXT;
        `);

        // 2. Create tool_pricing_history table
        console.log("Creating tool_pricing_history table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tool_pricing_history (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
                old_pricing TEXT,
                new_pricing TEXT,
                change_summary TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        console.log("✅ Pricing database setup complete.");
        process.exit(0);
    } catch (e) {
        console.error("❌ Error setting up pricing DB:", e);
        process.exit(1);
    }
}

main();
