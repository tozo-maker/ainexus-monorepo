require('dotenv').config({ path: ['.env.local', '.env'] });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
);

async function checkData() {
    console.log("=== REMOTE DATABASE STATE ===");
    const tables = ['tools', 'categories', 'companies', 'news_articles', 'videos', 'llm_models', 'reviews'];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.error(`Error checking ${table}:`, error.message);
        } else {
            console.log(`${table.padEnd(15)} : ${count} rows`);
        }
    }
}
checkData();
