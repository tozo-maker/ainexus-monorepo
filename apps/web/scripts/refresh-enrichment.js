const { Pool } = require('pg');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'password',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    database: process.env.POSTGRES_DB || 'ainexus',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY;

async function refreshEnrichment() {
    console.log("🚀 Starting Enrichment 2.0: Deep Metadata Mining...");

    const toolsRes = await pool.query('SELECT id, name, website_url, description, category_id, logo_url FROM tools WHERE twitter_url IS NULL LIMIT 100');
    console.log(`Found ${toolsRes.rows.length} tools to enrich.`);

    for (const tool of toolsRes.rows) {
        try {
            console.log(`\nProcessing: ${tool.name}...`);

            let brandData = null;
            if (BRANDFETCH_API_KEY && tool.website_url) {
                const url = new URL(tool.website_url);
                let domain = url.hostname.replace('www.', '');

                console.log(`  - Fetching Brandfetch for ${domain}...`);
                const bfRes = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
                    headers: { 'Authorization': `Bearer ${BRANDFETCH_API_KEY}` }
                });

                if (bfRes.ok) {
                    brandData = await bfRes.json();

                    // Update logo if missing or placeholder (like emoji or char)
                    if (brandData.logos && brandData.logos.length > 0) {
                        const bestLogo = brandData.logos.find(l => l.type === 'symbol' && l.theme === 'dark') ||
                            brandData.logos.find(l => l.type === 'symbol') ||
                            brandData.logos[0];
                        if (bestLogo && (tool.logo_url === null || tool.logo_url.length < 5)) {
                            // Extract src from formats
                            const logoUrl = bestLogo.formats[0].src;
                            await pool.query('UPDATE tools SET logo_url = $1 WHERE id = $2', [logoUrl, tool.id]);
                            console.log(`  - Updated logo from Brandfetch`);
                        }
                    }
                }
            }

            // Prepare Gemini Prompt for Analytics & Validation
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `
                Analyze this AI tool: ${tool.name}
                Category: ${tool.category_id}
                Description: ${tool.description}
                Website: ${tool.website_url}

                Task:
                1. Estimate its Market Share percentage within its category (0.1 to 100.0).
                2. Estimate its Popularity Score (1 to 100).
                3. Verify if it is a major, "Verified" industry leader (boolean).

                Return ONLY JSON:
                {
                  "market_share": number,
                  "popularity_score": number,
                  "is_verified": boolean
                }
            `;

            console.log(`  - Generating Gemini Analytics...`);
            const geminiResult = await model.generateContent(prompt);
            const geminiText = geminiResult.response.text().replace(/```json\n?|\n?```/g, '').trim();
            const analytics = JSON.parse(geminiText);

            // Extract Socials from Brandfetch if available
            const socials = {
                twitter: null,
                linkedin: null,
                github: null,
                discord: null
            };

            if (brandData && brandData.links) {
                console.log(`  - Found ${brandData.links.length} links in Brandfetch`);
                brandData.links.forEach(link => {
                    const name = link.name.toLowerCase();
                    const url = link.url.toLowerCase();
                    if (name.includes('twitter') || url.includes('twitter.com') || url.includes('x.com')) socials.twitter = link.url;
                    if (name.includes('linkedin') || url.includes('linkedin.com')) socials.linkedin = link.url;
                    if (name.includes('github') || url.includes('github.com')) socials.github = link.url;
                    if (name.includes('discord') || url.includes('discord.com') || url.includes('discord.gg')) socials.discord = link.url;
                });
                console.log(`  - Socials extracted: ${JSON.stringify(socials)}`);
            }

            // Update Database
            await pool.query(`
                UPDATE tools SET 
                    twitter_url = COALESCE($1, twitter_url),
                    linkedin_url = COALESCE($2, linkedin_url),
                    github_url = COALESCE($3, github_url),
                    discord_url = COALESCE($4, discord_url),
                    market_share = $5,
                    popularity_score = $6,
                    is_verified = $7,
                    last_enriched_at = NOW()
                WHERE id = $8
            `, [
                socials.twitter, socials.linkedin, socials.github, socials.discord,
                analytics.market_share, analytics.popularity_score, analytics.is_verified,
                tool.id
            ]);

            console.log(`  ✅ Successfully enriched ${tool.name}`);

        } catch (e) {
            console.error(`  ❌ Error enriching ${tool.name}:`, e.message);
        }
    }

    console.log("\n✨ Enrichment 2.0 batch complete.");
    await pool.end();
}

refreshEnrichment();
