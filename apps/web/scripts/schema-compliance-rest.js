require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

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
  
  // We don't have direct SQL execution out of the box so we are checking if there is a way
  // Often there is a "execute_sql" RPC function created for this purpose:
  console.log("Attempting to execute SQL over RPC...");
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    const data = await res.json();
    console.log("RPC Response:", res.status, data);
  } catch (e) {
    console.error("RPC execution failed:", e);
  }
}

addColumns();
