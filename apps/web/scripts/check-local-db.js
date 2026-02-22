require('dotenv').config({ path: ['.env.local', '.env'] });
const { Pool } = require('pg');

const pool = new Pool({
    user: 'admin',
    password: 'password',
    host: 'localhost',
    port: 5433,
    database: 'ainexus',
});

async function check() {
    try {
        const { rows } = await pool.query('SELECT count(*) FROM tools');
        console.log(`Found ${rows[0].count} tools in localhost:5433`);
    } catch (e) {
        console.error('Error connecting to local DB:', e.message);
    } finally {
        pool.end();
    }
}

check();
