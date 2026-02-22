import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

    const logs: string[] = [];

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { auth: { persistSession: false } }
        );

        // Fetch up to 5 tools that haven't been checked recently
        const { data: tools, error: toolsError } = await supabase
            .from('tools')
            .select('id, name, pricing_model, website_url, website_content_hash')
            .not('website_url', 'is', null)
            .order('price_checked_at', { ascending: true, nullsFirst: true })
            .limit(5);

        if (toolsError) throw toolsError;

        for (const tool of tools || []) {
            logs.push(`Checking ${tool.name} (${tool.website_url})...`);

            try {
                // Fetch page
                const res = await fetch(tool.website_url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
                    signal: AbortSignal.timeout(8000)
                });

                if (!res.ok) {
                    logs.push(`Failed to fetch ${tool.name}: ${res.status}`);
                    await supabase.from('tools').update({ price_checked_at: new Date().toISOString() }).eq('id', tool.id);
                    continue;
                }

                const html = await res.text();
                const $ = cheerio.load(html);

                // Clean up non-content
                $('script, style, nav, footer, header, noscript, iframe, svg').remove();

                // Get visible text and hash it
                let text = $('body').text().replace(/\s+/g, ' ').trim();
                if (text.length > 15000) text = text.slice(0, 15000); // Truncate to save tokens

                const currentHash = crypto.createHash('sha256').update(text).digest('hex');

                if (currentHash === tool.website_content_hash) {
                    logs.push(`-> No changes in content hash for ${tool.name}.`);
                    await supabase.from('tools').update({ price_checked_at: new Date().toISOString() }).eq('id', tool.id);
                    continue;
                }

                logs.push(`-> Content changed! Sending to Gemini to extract pricing info...`);

                // Content changed. Ask Gemini for structured pricing
                const prompt = `
                    You are an expert AI software analyst. Extract the pricing model of this AI tool based on its landing page text.
                    The current database has the pricing model as: "${tool.pricing_model || 'Unknown'}".
                    
                    Respond strictly in JSON:
                    {
                        "pricingModel": "free" | "freemium" | "paid" | "open-source" | "enterprise" | "usage-based",
                        "changed": boolean,
                        "changeSummary": "Explain briefly what the pricing or feature limits are now, and how they differ from the old one. If it's a new entry, just describe the pricing."
                    }

                    Landing page text:
                    ${text}
                `;

                const result = await model.generateContent(prompt);
                const responseData = JSON.parse(result.response.text());

                // Update hash and checked time
                await supabase.from('tools').update({
                    website_content_hash: currentHash,
                    price_checked_at: new Date().toISOString()
                }).eq('id', tool.id);

                // If pricing changed, update tools AND insert history log
                if (responseData.changed && responseData.pricingModel !== tool.pricing_model) {
                    logs.push(`-> PRICING CHANGE DETECTED: ${tool.pricing_model} -> ${responseData.pricingModel}`);

                    await supabase.from('tools').update({ pricing_model: responseData.pricingModel }).eq('id', tool.id);

                    await supabase.from('tool_pricing_history').insert({
                        tool_id: tool.id,
                        old_pricing_model: tool.pricing_model,
                        new_pricing_model: responseData.pricingModel,
                        content_hash: responseData.changeSummary
                    });

                    // In the future: trigger PricingAlertEmail to subscribers here
                } else {
                    logs.push(`-> No pricing change. It was just content updates.`);
                }

            } catch (err: any) {
                logs.push(`Error checking ${tool.name}: ${err.message}`);
                await supabase.from('tools').update({ price_checked_at: new Date().toISOString() }).eq('id', tool.id);
            }
        }

        return NextResponse.json({ success: true, processed: tools.length, logs });

    } catch (e: any) {
        console.error("Cron Error: ", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
