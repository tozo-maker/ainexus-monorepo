import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const pool = new Pool({
    connectionString: \`postgresql://postgres.ryfsshhcrdntfhmzexlk:\${process.env.SUPABASE_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres\`,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        console.log("Creating user_preferences table...");
        
        await pool.query(\`
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                pricing_alerts BOOLEAN DEFAULT TRUE,
                newsletter BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        \`);
        console.log("✅ Created user_preferences table");

    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await pool.end();
    }
}

main();
