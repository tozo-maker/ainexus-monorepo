require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('Missing DATABASE_URL in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
});

async function addColumns() {
    const sql = `
    ALTER TABLE tools
    ADD COLUMN IF NOT EXISTS scoring_rationale TEXT,
    ADD COLUMN IF NOT EXISTS compliance_last_reviewed DATE;
    
    UPDATE tools 
    SET compliance_last_reviewed = CURRENT_DATE 
    WHERE compliance_last_reviewed IS NULL;
  `;

    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL, executing DDL for Phase 6...");
        await client.query(sql);
        console.log("Successfully added scoring_rationale and compliance_last_reviewed to tools table. Existing rows backfilled with today's date.");
        client.release();
    } catch (e) {
        console.error("Failed to execute DDL:", e);
    } finally {
        pool.end();
    }
}

addColumns();
