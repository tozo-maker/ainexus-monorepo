    ALTER TABLE tools
    ADD COLUMN IF NOT EXISTS eu_ai_act_risk_tier TEXT,
    ADD COLUMN IF NOT EXISTS compliance_score INTEGER,
    ADD COLUMN IF NOT EXISTS data_governance_grade TEXT,
    ADD COLUMN IF NOT EXISTS gdpr_compliant BOOLEAN,
    ADD COLUMN IF NOT EXISTS trains_on_user_data BOOLEAN,
    ADD COLUMN IF NOT EXISTS transparency_index INTEGER;
