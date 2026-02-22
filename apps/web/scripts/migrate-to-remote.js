require('dotenv').config({ path: ['.env.local', '.env'] });
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// Local Source DB
const localPool = new Pool({
    user: 'admin',
    password: 'password',
    host: 'localhost',
    port: 5433,
    database: 'ainexus',
});

// Remote Destination DB
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
);

async function migrateTable(tableName, orderByCol = 'id') {
    console.log(`\nMigrating table: ${tableName}...`);
    try {
        const { rows } = await localPool.query(`SELECT * FROM ${tableName} ORDER BY ${orderByCol} ASC`);

        if (rows.length === 0) {
            console.log(`Skipping - 0 rows found in ${tableName}`);
            return;
        }

        console.log(`Found ${rows.length} rows to migrate.`);

        // Supabase upserts max out around 1000 rows, so we chunk it just to be safe (100 rows per batch)
        const chunkSize = 100;
        let successCount = 0;

        for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            const { data, error } = await supabase.from(tableName).upsert(chunk, { onConflict: (tableName === 'tools' || tableName === 'companies' || tableName === 'categories' || tableName === 'llm_models') ? 'slug' : 'id' });

            if (error) {
                console.error(`Error upserting ${tableName} batch ${i}-${i + chunk.length}:`, error.message);

                // Let's try to print the error payload for debugging
                console.error("Payload sample:", JSON.stringify(chunk[0]).slice(0, 200));

                throw error; // Stop immediately to prevent orphan records
            }
            successCount += chunk.length;
            process.stdout.write(`\rSuccessfully upserted: ${successCount}/${rows.length}`);
        }
        console.log(`\n✅ Completed ${tableName}`);
    } catch (e) {
        console.error(`\n❌ Failed to migrate ${tableName}:`, e.message);
    }
}

async function runMigration() {
    console.log("=== Starting Data Migration from Local to Remote ===");

    // Check if the local pool is healthy
    try {
        await localPool.query('SELECT 1');
        console.log("✅ Local Database Connection Established");
    } catch (e) {
        console.error("❌ Cannot connect to local database on port 5433!");
        process.exit(1);
    }

    // Order matters for Foreign Keys!
    await migrateTable('categories', 'slug');
    await migrateTable('companies', 'slug');
    await migrateTable('tags', 'slug');

    await migrateTable('tools', 'slug');
    await migrateTable('llm_models', 'slug');

    await migrateTable('youtube_channels', 'channel_id');
    await migrateTable('videos', 'youtube_id');

    console.log("\n=== Migration Finished ===");
    await localPool.end();
}

runMigration();
