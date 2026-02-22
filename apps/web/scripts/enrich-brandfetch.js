const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY;

if (!BRANDFETCH_API_KEY) {
    console.error("Missing BRANDFETCH_API_KEY environment variable. Pass it inline: BRANDFETCH_API_KEY=xxx node script.js");
    process.exit(1);
}

async function run() {
    console.log("Starting Brandfetch enrichment batch process...");

    const toolsRes = await pool.query('SELECT id, name, website_url, description, company_id FROM tools');
    console.log(`Found ${toolsRes.rows.length} tools to enrich.`);

    for (const tool of toolsRes.rows) {
        if (!tool.website_url) continue;

        try {
            const url = new URL(tool.website_url);
            let domain = url.hostname;
            if (domain.startsWith('www.')) domain = domain.slice(4);

            console.log(`Fetching Brandfetch data: ${domain} (for ${tool.name})...`);

            const res = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
                headers: {
                    'Authorization': `Bearer ${BRANDFETCH_API_KEY}`
                }
            });

            if (!res.ok) {
                console.log(`  -> Failed to fetch ${domain}: ${res.status}`);
                continue;
            }

            const data = await res.json();

            // Extraction logic for the best available logo/icon
            let logoUrl = null;
            let iconUrl = null;

            if (data.logos) {
                const logoObj = data.logos.find(l => l.type === 'logo' && l.theme === 'dark') || data.logos.find(l => l.type === 'logo');
                if (logoObj && logoObj.formats.length > 0) {
                    const svg = logoObj.formats.find(f => f.format === 'svg');
                    const png = logoObj.formats.find(f => f.format === 'png');
                    logoUrl = svg ? svg.src : (png ? png.src : logoObj.formats[0].src);
                }

                const iconObj = data.logos.find(l => l.type === 'icon' && l.theme === 'dark') || data.logos.find(l => l.type === 'icon');
                if (iconObj && iconObj.formats.length > 0) {
                    const svg = iconObj.formats.find(f => f.format === 'svg');
                    const png = iconObj.formats.find(f => f.format === 'png');
                    iconUrl = svg ? svg.src : (png ? png.src : iconObj.formats[0].src);
                }
            }

            // Try to use the square icon if possible for standard "Tool Cards", else fallback to long-form logo
            const finalLogo = iconUrl || logoUrl;

            // Enrich markdown description
            let additionalDesc = "";
            if (data.longDescription || data.description) {
                additionalDesc += `\n\n### About the Company\n${data.longDescription || data.description}`;
            }

            if (data.links && data.links.length > 0) {
                additionalDesc += `\n\n### Social Links\n`;
                for (const link of data.links) {
                    additionalDesc += `- [${link.name}](${link.url})\n`;
                }
            }

            // Check if we already appended this data so we don't duplicate on multi-runs
            let newDescription = tool.description || "";
            if (!newDescription.includes("### About the Company") && additionalDesc) {
                newDescription += additionalDesc;
            }

            if (finalLogo || newDescription !== tool.description) {
                await pool.query(
                    'UPDATE tools SET logo_url = COALESCE($1, logo_url), description = $2, updated_at = NOW() WHERE id = $3',
                    [finalLogo, newDescription, tool.id]
                );
                console.log(`  -> Valid enrichment applied for ${tool.name}.`);
            }

            // Enrich company data if linked
            if (tool.company_id) {
                await pool.query(
                    'UPDATE companies SET logo_url = COALESCE($1, logo_url), description = COALESCE($2, description), updated_at = NOW() WHERE id = $3',
                    [logoUrl || finalLogo, data.description || data.longDescription, tool.company_id]
                );
            }

            // Sleep to respect Brandfetch rate limits
            await new Promise(r => setTimeout(r, 500));

        } catch (e) {
            console.error(`  -> Error processing ${tool.name}:`, e.message);
        }
    }

    console.log("Brandfetch enrichment script completed.");
    pool.end();
}

run();
