require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Service key optimal, but anon might work if RLS is off

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const overrides = [
    {
        name: "Claude",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 87,
        data_governance_grade: "A",
        gdpr_compliant: true,
        trains_on_user_data: false,
        transparency_index: 82,
        scoring_rationale: "General-purpose LLM assistant — Minimal Risk by design. Anthropic publishes Constitutional AI research and a model card. Does not train on user conversations by default. Strong GDPR DPA available at privacy.anthropic.com.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "ChatGPT",
        eu_ai_act_risk_tier: "limited",
        compliance_score: 71,
        data_governance_grade: "B",
        gdpr_compliant: true,
        trains_on_user_data: true,
        transparency_index: 68,
        scoring_rationale: "Limited Risk: public-facing conversational agent requires EU AI Act Article 50 transparency obligations. Trains on conversations unless opted out via settings. GDPR DPA available. OpenAI has published system cards and safety evaluations.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Cursor",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 74,
        data_governance_grade: "B",
        gdpr_compliant: true,
        trains_on_user_data: true,
        transparency_index: 65,
        scoring_rationale: "General-purpose coding assistant — Minimal Risk. Uses code context to improve models unless Privacy Mode is enabled. SOC2 Type II certified. No published model card for the underlying model.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Midjourney",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 52,
        data_governance_grade: "C",
        gdpr_compliant: false,
        trains_on_user_data: true,
        transparency_index: 38,
        scoring_rationale: "General-purpose image generation — Minimal Risk. Trains on all user prompts and outputs with no opt-out mechanism. No formal GDPR DPA. No published model card. Ongoing IP and copyright litigation regarding training data.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "ElevenLabs",
        eu_ai_act_risk_tier: "limited",
        compliance_score: 65,
        data_governance_grade: "B",
        gdpr_compliant: true,
        trains_on_user_data: false,
        transparency_index: 61,
        scoring_rationale: "Limited Risk: voice cloning creates synthetic audio requiring Article 50 disclosure obligations. Does not train on user audio by default. GDPR DPA available. Responsible AI policy published on website.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Kling AI",
        eu_ai_act_risk_tier: "limited",
        compliance_score: 38,
        data_governance_grade: "D",
        gdpr_compliant: false,
        trains_on_user_data: true,
        transparency_index: 22,
        scoring_rationale: "Limited Risk: generates synthetic video requiring Article 50 disclosure. Chinese operator with minimal EU-facing compliance documentation. No published model card. Privacy policy vague on data retention. No GDPR DPA located.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Perplexity",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 74,
        data_governance_grade: "B",
        gdpr_compliant: true,
        trains_on_user_data: false,
        transparency_index: 70,
        scoring_rationale: "General-purpose AI search — Minimal Risk. Privacy policy explicitly states search queries are not used to train models. GDPR policy documented. Limited model-level transparency — no model card published.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Stable Diffusion",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 88,
        data_governance_grade: "A",
        gdpr_compliant: true,
        trains_on_user_data: false,
        transparency_index: 92,
        scoring_rationale: "Open-source image generation — Minimal Risk. Self-hosted deployments have zero centralised data collection, earning an automatic A grade. Model weights fully open. Training dataset (LAION) publicly documented.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Ollama",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 94,
        data_governance_grade: "N/A",
        gdpr_compliant: true,
        trains_on_user_data: false,
        transparency_index: 96,
        scoring_rationale: "Fully local, self-hosted LLM runner — Minimal Risk. Zero centralised data collection; the user owns all data entirely. N/A data governance grade reflects complete data sovereignty. Open-source with active GitHub community.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Suno",
        eu_ai_act_risk_tier: "limited",
        compliance_score: 55,
        data_governance_grade: "C",
        gdpr_compliant: false,
        trains_on_user_data: true,
        transparency_index: 42,
        scoring_rationale: "Limited Risk: generates synthetic vocals that could be mistaken for real artists, triggering Article 50 obligations. Trains on user-generated songs. No GDPR DPA available. Active copyright litigation regarding training data sources.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Runway",
        eu_ai_act_risk_tier: "limited",
        compliance_score: 61,
        data_governance_grade: "C",
        gdpr_compliant: false,
        trains_on_user_data: true,
        transparency_index: 52,
        scoring_rationale: "Limited Risk: generates synthetic video media under Article 50. ToS grants Runway rights to use content for training. No GDPR DPA found. Published some model research but no formal model card.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    },
    {
        name: "Replit",
        eu_ai_act_risk_tier: "minimal",
        compliance_score: 72,
        data_governance_grade: "B",
        gdpr_compliant: true,
        trains_on_user_data: true,
        transparency_index: 67,
        scoring_rationale: "General-purpose cloud IDE — Minimal Risk. Uses code to improve AI models per ToS. SOC2 Type II certified. GDPR DPA available. No published model card for the Ghostwriter AI feature.",
        compliance_last_reviewed: new Date().toISOString().split('T')[0]
    }
];

async function applyOverrides() {
    console.log("Applying manual risk tier overrides from rubric...");
    for (const item of overrides) {
        const { name, ...updates } = item;

        // Attempt to update
        const { data, error } = await supabase
            .from('tools')
            .update(updates)
            .ilike('name', `%${name}%`);

        if (error) {
            console.error(`Error updating ${name}:`, error.message);
        } else {
            console.log(`Successfully override mapped: ${name}`);
        }
    }

    // Bulk update the remainder of the directory
    console.log("Backfilling missing scoring limits...");
    const { error: bulkError } = await supabase
        .from('tools')
        .update({
            scoring_rationale: 'Score estimated based on publicly available documentation.',
            compliance_last_reviewed: new Date().toISOString().split('T')[0]
        })
        .is('scoring_rationale', null);

    if (bulkError) {
        console.log("Bulk update error (might need more specific querying or RLS is blocking):", bulkError.message);
    } else {
        console.log("Backfilled other tools successfully.");
    }

    console.log("Override script complete.");
}

applyOverrides();
