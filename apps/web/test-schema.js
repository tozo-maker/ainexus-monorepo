require('dotenv').config({ path: ['.env.local', '.env'] });
const { Pool } = require('pg');
const pool = new Pool();
pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['tool_pricing_history']).then(res => { console.log(res.rows); process.exit(0); });
