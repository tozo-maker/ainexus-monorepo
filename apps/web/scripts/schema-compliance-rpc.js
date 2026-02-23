require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addComplianceSchema() {
  console.log('Adding Compliance Schema to tools table...');
  
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
  const { data, error } = await supabase.rpc('execute_sql', { query: sql });
  
  if (error) {
     console.error("RPC Error:", error);
     return;
  }
  console.log("Success:", data);
}

addComplianceSchema();
