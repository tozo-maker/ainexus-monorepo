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
    ADD COLUMN IF NOT EXISTS eu_ai_act_risk_tier TEXT,
    ADD COLUMN IF NOT EXISTS compliance_score INTEGER,
    ADD COLUMN IF NOT EXISTS data_governance_grade TEXT,
    ADD COLUMN IF NOT EXISTS gdpr_compliant BOOLEAN,
    ADD COLUMN IF NOT EXISTS trains_on_user_data BOOLEAN,
    ADD COLUMN IF NOT EXISTS transparency_index INTEGER;
  `;
  
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL, executing DDL...");
    await client.query(sql);
    console.log("Successfully added compliance columns to tools table.");
    client.release();
  } catch (e) {
    console.error("Failed to execute DDL:", e);
  } finally {
    pool.end();
  }
}

addColumns();
