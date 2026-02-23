require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY is missing.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const ComplianceSchema = z.object({
    description: z.string().describe("A clean, objective, 2-3 sentence feature-focused product description. No company 'about us' fluff."),
    eu_ai_act_risk_tier: z.enum(['Minimal', 'Limited', 'High', 'Unacceptable', 'Unclassified']),
    compliance_score: z.number().min(0).max(100),
    data_governance_grade: z.enum(['A', 'B', 'C', 'D', 'F']),
    gdpr_compliant: z.boolean(),
    trains_on_user_data: z.boolean(),
    transparency_index: z.number().min(0).max(100)
});

async function processTool(tool) {
    console.log(`\n[Process] ${tool.name}...`);

    const prompt = `
You are an expert AI software directory curator and compliance auditor.
I have a database record for an AI tool. I need you to do two things based on its current description and name.

1. Rewrite the description to be purely objective and feature-focused (2-3 sentences). Remove all marketing fluff or "About the Company" sections.
2. Determine a realistic but hypothetical set of EU AI Act and GDPR compliance metrics based on the type of tool it is.

Tool Name: ${tool.name}
Current Description: ${tool.description || 'N/A'}

Please extract the following fields in strict JSON format matching this schema:
{
  "description": "Clean, objective product description",
  "eu_ai_act_risk_tier": "Minimal, Limited, High, Unacceptable, or Unclassified",
  "compliance_score": 0-100 integer,
  "data_governance_grade": "A, B, C, D, or F",
  "gdpr_compliant": true/false (hypothetical realistic guess based on typical enterprise readiness),
  "trains_on_user_data": true/false (hypothetical),
  "transparency_index": 0-100 integer
}
ONLY return valid JSON. No markdown ticks if possible, or strip them.
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        let text = result.response.text();

        let jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        const output = JSON.parse(jsonStr);
        const valid = ComplianceSchema.parse(output);

        // Update Supabase
        const { error } = await supabase
            .from('tools')
            .update({
                description: valid.description,
                eu_ai_act_risk_tier: valid.eu_ai_act_risk_tier,
                compliance_score: valid.compliance_score,
                data_governance_grade: valid.data_governance_grade,
                gdpr_compliant: valid.gdpr_compliant,
                trains_on_user_data: valid.trains_on_user_data,
                transparency_index: valid.transparency_index
            })
            .eq('id', tool.id);

        if (error) {
            console.error(`❌ DB Update Failed for ${tool.name}:`, error);
        } else {
            console.log(`✅ Successfully updated ${tool.name} (Risk: ${valid.eu_ai_act_risk_tier}, Score: ${valid.compliance_score})`);
        }
    } catch (e) {
        console.error(`❌ Processing Failed for ${tool.name}:`, e.message);
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log("Fetching tools without compliance data...");

    const { data: tools, error } = await supabase
        .from('tools')
        .select('id, name, description')
        .is('eu_ai_act_risk_tier', null);

    if (error) {
        console.error("Fetch error:", error);
        return;
    }

    console.log(`Found ${tools.length} tools to process.`);

    for (let i = 0; i < tools.length; i++) {
        await processTool(tools[i]);
        if (i < tools.length - 1) {
            await delay(1500); // rate limiting
        }
    }

    console.log("Compliance seeding complete!");
}

main();
