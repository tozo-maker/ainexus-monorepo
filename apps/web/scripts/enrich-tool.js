const cheerio = require('cheerio');
const { z } = require('zod');
const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// --- Configuration ---
const DATABASE_URL = process.env.DATABASE_URL || `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY is missing from environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// --- Schema Definition for Tool Data ---
const ToolSchema = z.object({
    name: z.string(),
    tagline: z.string().max(150),
    description: z.string().max(800),
    pricingModel: z.enum(['free', 'freemium', 'paid', 'open-source', 'enterprise', 'usage-based']),
    hasFreeTier: z.boolean(),
    hasApi: z.boolean(),
    isOpenSource: z.boolean(),
    tags: z.array(z.string()).max(6),
    platforms: z.array(z.string()),
    category: z.string().describe("The most fitting category for this tool"),
    company: z.string(),
});

async function scrape(url) {
    console.log(`[Scrape] Fetching HTML for: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`[Scrape] Warning: HTTP error! status: ${response.status}. Site might be blocking fetch.`);
            return { title: url, metaDesc: '', content: '' };
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('title').text() || '';
        const metaDesc = $('meta[name="description"]').attr('content') || '';

        // Remove scripts, styles, and other non-content elements
        $('script, style, noscript, iframe, svg, nav, header, footer').remove();

        // Get text content
        let content = $('body').text().replace(/\s+/g, ' ').trim();

        return { title, metaDesc, content: content.slice(0, 15000) };
    } catch (e) {
        clearTimeout(timeoutId);
        console.warn(`[Scrape] Scraping failed or timed out: ${e.message}. Falling back to LLM internal knowledge.`);
        return { title: url, metaDesc: '', content: '' };
    }
}

async function enrichWithGemini(scrapedData, url) {
    console.log(`[Enrich] Extracting structured JSON with Gemini 2.0 Flash...`);

    const prompt = `
You are an expert AI software directory curator.
I have scraped a landing page for an AI tool. 
Your job is to extract structured metadata about this tool.

URL: ${url}
Title: ${scrapedData.title || 'Unknown'}
Meta Description: ${scrapedData.metaDesc || 'Unknown'}
---
Page Content (truncated):
${scrapedData.content ? scrapedData.content : '(No page content could be scraped. Please rely on your extensive internal knowledge of this AI tool/product based on the URL and name.)'}
---

Please extract the following fields in strict JSON format. ONLY return valid JSON, nothing else.
{
  "name": "The official name of the tool",
  "tagline": "A short, punchy 1-sentence value prop (max 150 chars)",
  "description": "A clear 2-3 sentence description of what it does (max 300 chars)",
  "pricingModel": "One of: free, freemium, paid, open-source, enterprise, usage-based",
  "hasFreeTier": true/false (does it offer a free version or trial?),
  "hasApi": true/false (does it offer a developer API?),
  "isOpenSource": true/false (is the core code open source?),
  "tags": ["Array of 3-6 relevant tags, lowercase"],
  "platforms": ["Array of platforms it runs on, e.g. Web, Mac, Windows, Slack. Empty array if strictly web."],
  "category": "Best fitting core category (e.g. LLM Chat, Image Generation, Code Assistant)",
  "company": "Name of the company/creator"
}`;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        tools: [{
            googleSearch: {}
        }]
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (err) {
        console.error("Failed to parse Gemini output as JSON:", text);
        throw new Error("Invalid output format from Gemini");
    }
}

async function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function fetchBrandfetchData(url) {
    if (!process.env.BRANDFETCH_API_KEY) return { socials: {}, logoUrl: null, bfDescription: null };

    console.log(`[Brandfetch] Requesting assets...`);
    const socials = { twitter: null, linkedin: null, github: null, discord: null };
    let logoUrl = null;
    let bfDescription = null;

    try {
        let domain = new URL(url).hostname;
        if (domain.startsWith('www.')) domain = domain.slice(4);

        const bfRes = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
            headers: { 'Authorization': `Bearer ${process.env.BRANDFETCH_API_KEY}` }
        });

        if (bfRes.ok) {
            const brandData = await bfRes.json();

            // Map links
            if (brandData.links) {
                brandData.links.forEach(link => {
                    const name = link.name.toLowerCase();
                    const lurl = link.url.toLowerCase();
                    if (name.includes('twitter') || lurl.includes('twitter.com') || lurl.includes('x.com')) socials.twitter = link.url;
                    if (name.includes('linkedin') || lurl.includes('linkedin.com')) socials.linkedin = link.url;
                    if (name.includes('github') || lurl.includes('github.com')) socials.github = link.url;
                    if (name.includes('discord') || lurl.includes('discord.com') || lurl.includes('discord.gg')) socials.discord = link.url;
                });
            }

            // Map description
            if (brandData.longDescription || brandData.description) {
                bfDescription = brandData.longDescription || brandData.description;
            }

            // Find best logo (square icon preferred for grids)
            if (brandData.logos) {
                const iconObj = brandData.logos.find(l => l.type === 'icon' && l.theme === 'dark') || brandData.logos.find(l => l.type === 'icon');
                if (iconObj && iconObj.formats.length > 0) {
                    const svg = iconObj.formats.find(f => f.format === 'svg');
                    const png = iconObj.formats.find(f => f.format === 'png');
                    logoUrl = svg ? svg.src : (png ? png.src : iconObj.formats[0].src);
                }

                // Fallback to logo if no icon
                if (!logoUrl) {
                    const logoObj = brandData.logos.find(l => l.type === 'logo' && l.theme === 'dark') || brandData.logos.find(l => l.type === 'logo');
                    if (logoObj && logoObj.formats.length > 0) {
                        const svg = logoObj.formats.find(f => f.format === 'svg');
                        const png = logoObj.formats.find(f => f.format === 'png');
                        logoUrl = svg ? svg.src : (png ? png.src : logoObj.formats[0].src);
                    }
                }
            }
            console.log(`[Brandfetch] Success -> Logo: ${logoUrl ? 'Found' : 'Missing'}`);
        } else {
            console.log(`[Brandfetch] Failed to fetch layout for ${domain}: ${bfRes.status}`);
        }
    } catch (e) {
        console.error(`[Brandfetch] API Call Failed:`, e.message);
    }

    return { socials, logoUrl, bfDescription };
}

async function saveToDb(data, url, companyStats) {
    const slug = await slugify(data.name);

    // 1. Upsert Category
    let catId;
    const catRes = await pool.query('SELECT id FROM categories WHERE name = $1', [data.category]);
    if (catRes.rows.length > 0) {
        catId = catRes.rows[0].id;
    } else {
        const newCat = await pool.query(
            'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
            [data.category, await slugify(data.category), `Tools for ${data.category}`]
        );
        catId = newCat.rows[0].id;
        console.log(`[DB] Created new category: ${data.category}`);
    }

    // 2. Upsert Company
    let compId;
    const compRes = await pool.query('SELECT id FROM companies WHERE name = $1', [data.company]);
    if (compRes.rows.length > 0) {
        compId = compRes.rows[0].id;
        // Optionally update company logo if we found one now
        if (companyStats.logoUrl) {
            await pool.query('UPDATE companies SET logo_url = COALESCE(logo_url, $1) WHERE id = $2', [companyStats.logoUrl, compId]);
        }
    } else {
        const newComp = await pool.query(
            'INSERT INTO companies (name, slug, website, logo_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [data.company, await slugify(data.company), '', companyStats.logoUrl, companyStats.bfDescription]
        );
        compId = newComp.rows[0].id;
        console.log(`[DB] Created new company: ${data.company}`);
    }

    // Append Brandfetch description or links if generated
    let finalDescription = data.description;
    if (companyStats.bfDescription && !finalDescription.includes("About the Company")) {
        finalDescription += `\n\n### About the Company\n${companyStats.bfDescription}`;
    }

    // 3. Upsert Tool
    const existing = await pool.query('SELECT id FROM tools WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
        console.log(`[DB] Tool ${data.name} already exists. Updating...`);
        await pool.query(
            `UPDATE tools SET 
                description = $1, 
                tagline = $2,
                pricing_model = $3, 
                has_free_tier = $4,
                has_api = $5, 
                is_open_source = $6,
                tags = $7,
                platforms = $8,
                website_url = $9,
                twitter_url = COALESCE($10, twitter_url),
                linkedin_url = COALESCE($11, linkedin_url),
                github_url = COALESCE($12, github_url),
                discord_url = COALESCE($13, discord_url),
                logo_url = COALESCE($14, logo_url),
                updated_at = NOW()
             WHERE slug = $15`,
            [
                finalDescription, data.tagline, data.pricingModel, data.hasFreeTier,
                data.hasApi, data.isOpenSource, data.tags, data.platforms, url,
                companyStats.socials.twitter, companyStats.socials.linkedin, companyStats.socials.github, companyStats.socials.discord, companyStats.logoUrl,
                slug
            ]
        );
    } else {
        console.log(`[DB] Inserting new tool: ${data.name}`);
        await pool.query(
            `INSERT INTO tools (
                slug, name, tagline, description, website_url, category_id, company_id, 
                tags, platforms, pricing_model, has_free_tier, has_api, is_open_source, 
                twitter_url, linkedin_url, github_url, discord_url, logo_url,
                avg_rating, review_count, is_featured, weekly_growth
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 0, 0, false, 0)`,
            [
                slug, data.name, data.tagline, finalDescription, url, catId, compId,
                data.tags, data.platforms, data.pricingModel, data.hasFreeTier, data.hasApi, data.isOpenSource,
                companyStats.socials.twitter, companyStats.socials.linkedin, companyStats.socials.github, companyStats.socials.discord, companyStats.logoUrl
            ]
        );
    }
}

async function processUrl(url) {
    if (!url || !url.startsWith('http')) {
        console.error(`[Skip] Invalid URL: ${url}`);
        return;
    }

    try {
        const scraped = await scrape(url);
        if (!scraped.content || scraped.content.length < 50) {
            console.log(`[Warning] Scraped content for ${url} is extremely short. It may be a heavily client-side rendered app blocking basic scraping.`);
        }

        const enriched = await enrichWithGemini(scraped, url);

        // Validate against Zod Schema
        const valid = ToolSchema.parse(enriched);

        // Fetch supplemental assets
        const brandData = await fetchBrandfetchData(url);

        await saveToDb(valid, url, brandData);
        console.log(`✅ Successfully pipelined ${valid.name}.`);
    } catch (e) {
        console.error(`❌ Pipeline Failed for ${url}:`, e.message);
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
    const input = process.argv[2];
    if (!input) {
        console.error("Usage: node scripts/enrich-tool.js <url_or_file_path>");
        process.exit(1);
    }

    const fs = require('fs');
    const path = require('path');

    try {
        if (fs.existsSync(input) && !input.startsWith('http')) {
            console.log(`[Batch] Reading URLs from file: ${input}`);
            const content = fs.readFileSync(input, 'utf-8');
            const urls = content.split('\n').map(u => u.trim()).filter(u => u.length > 0);

            console.log(`[Batch] Found ${urls.length} URLs to process.`);

            for (let i = 0; i < urls.length; i++) {
                console.log(`\n[Batch] Processing ${i + 1}/${urls.length}: ${urls[i]}`);
                await processUrl(urls[i]);
                if (i < urls.length - 1) {
                    await delay(2000); // 2-second rate limit pause
                }
            }
        } else {
            await processUrl(input);
        }
    } catch (e) {
        console.error("Main Error:", e);
    } finally {
        await pool.end();
    }
}

main();
