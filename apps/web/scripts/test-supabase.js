
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log(`Connecting to Supabase at: ${supabaseUrl}`);
    try {
        // Try to fetch something public or just get session to verify client init works
        // Since we are anon, we can just check if client is ready or try a public query.
        // Let's just check if auth service is responsive by getting session (should be null but not crash)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Supabase connection error:', error.message);
        } else {
            console.log('✅ Supabase client initialized successfully.');
            console.log('Session Status:', data.session ? 'Active' : 'No Active Session (Expected)');
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

testConnection();
