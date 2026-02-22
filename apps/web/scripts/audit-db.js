const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5433,
    database: process.env.POSTGRES_DB || 'ainexus',
});

async function audit() {
    try {
        const total = await pool.query('SELECT COUNT(*) FROM tools');
        const enriched = await pool.query('SELECT COUNT(*) FROM tools WHERE last_enriched_at IS NOT NULL');
        const withSocials = await pool.query('SELECT COUNT(*) FROM tools WHERE twitter_url IS NOT NULL OR github_url IS NOT NULL');
        const categories = await pool.query('SELECT c.name, COUNT(t.id) as count FROM categories c LEFT JOIN tools t ON t.category_id = c.id GROUP BY c.name');

        console.log(`Total Tools: ${total.rows[0].count}`);
        console.log(`Enriched Tools: ${enriched.rows[0].count}`);
        console.log(`Tools with Socials: ${withSocials.rows[0].count}`);
        console.log('\nCategories:');
        categories.rows.forEach(r => console.log(` - ${r.name}: ${r.count}`));

        const sample = await pool.query('SELECT name, twitter_url, last_enriched_at FROM tools WHERE last_enriched_at IS NOT NULL LIMIT 5');
        console.log('\nEnriched Samples:');
        sample.rows.forEach(r => console.log(` - ${r.name}: ${r.twitter_url || 'No Twitter'}`));

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

audit();
