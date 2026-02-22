require('dotenv').config({ path: ['.env.local', '.env'] });
const { Pool } = require('pg');

const localPool = new Pool({
    user: 'admin',
    password: 'password',
    host: 'localhost',
    port: 5433,
    database: 'ainexus',
});

async function check() {
    try {
        const { rows } = await localPool.query('SELECT * FROM tools LIMIT 1');
        console.log(`Local Columns: \n` + Object.keys(rows[0]).join(', '));
    } catch (e) {
        console.error('Error connecting to local DB:', e.message);
    } finally {
        localPool.end();
    }
}

check();
