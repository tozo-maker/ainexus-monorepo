import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const RSS_FEEDS = [
    { url: 'https://techcrunch.com/feed/', sourceName: 'TechCrunch' },
    { url: 'https://www.theverge.com/rss/index.xml', sourceName: 'The Verge' },
    { url: 'https://venturebeat.com/feed/', sourceName: 'VentureBeat' },
];

export async function GET(request: Request) {
    const diagnosticLogs: string[] = [];
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable" }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { auth: { persistSession: false } }
        );

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });

        const articlesToInsert: any[] = [];

        for (const feed of RSS_FEEDS) {
            diagnosticLogs.push(`Fetching RSS feed from: ${feed.sourceName}`);

            // Resolve source_id from the database
            let sourceId;
            const { data: sourceRes } = await supabase
                .from('news_sources')
                .select('id')
                .eq('name', feed.sourceName)
                .single();

            if (sourceRes) {
                sourceId = sourceRes.id;
            } else {
                // Insert if source doesn't exist
                const { data: insertSourceRes, error } = await supabase
                    .from('news_sources')
                    .insert({ name: feed.sourceName, url: new URL(feed.url).origin })
                    .select('id')
                    .single();

                if (error) {
                    diagnosticLogs.push(`Failed to insert source ${feed.sourceName}: ${error.message}`);
                    continue;
                }
                sourceId = insertSourceRes.id;
            }

            // Fetch XML
            const response = await fetch(feed.url, {
                next: { revalidate: 0 },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            if (!response.ok) {
                diagnosticLogs.push(`Failed to fetch ${feed.url}: ${response.statusText}`);
                continue;
            }

            const xmlText = await response.text();
            const json = parser.parse(xmlText);

            let items: any[] = [];
            if (json.rss && json.rss.channel && json.rss.channel.item) {
                items = Array.isArray(json.rss.channel.item) ? json.rss.channel.item : [json.rss.channel.item];
            } else if (json.feed && json.feed.entry) {
                items = Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry];
            }

            const topItems = items.slice(0, 5); // Process top 5 to keep execution fast

            for (const item of topItems) {
                let title = item.title;
                if (typeof title === 'object' && title !== null) {
                    title = title['#text'] || Object.values(title)[0] || JSON.stringify(title);
                }
                title = String(title || 'Untitled');

                // Check if already in DB before calling Gemini
                const { data: existingRes } = await supabase
                    .from('news_articles')
                    .select('id')
                    .eq('title', title)
                    .maybeSingle();

                if (existingRes) {
                    diagnosticLogs.push(`Skipped duplicate (DB check): ${title}`);
                    continue;
                }

                let link = item.link;
                if (typeof link === 'object' && link !== null && link['@_href']) {
                    link = link['@_href'];
                }

                const publishedAt = item.pubDate || item.published || item.updated || new Date().toISOString();

                let snippet = item.description || item.content || "";
                if (typeof snippet === 'object') snippet = JSON.stringify(snippet);
                snippet = String(snippet).replace(/<[^>]+>/g, '').slice(0, 300);

                // Use Gemini for categorization
                let category = 'opinion';

                try {
                    const prompt = `Categorize this tech news article into exactly one of these categories: "product-launch", "funding", "acquisition", "open-source", "research", "regulation", or "opinion". 
                    Respond with ONLY the exact string from that list, nothing else.
                    
                    Title: ${title}
                    Summary: ${snippet}`;

                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text().trim().toLowerCase();

                    if (["product-launch", "funding", "acquisition", "open-source", "research", "regulation", "opinion"].includes(responseText)) {
                        category = responseText;
                    }
                } catch (e) {
                    console.log("[Gemini Error] Defaulting category to opinion. Error: ", e);
                }

                articlesToInsert.push({
                    source_id: sourceId,
                    title: title,
                    external_url: link,
                    published_at: new Date(publishedAt).toISOString(),
                    category: category,
                    is_hot: false
                });
            }
        }

        let insertedCount = 0;
        for (const article of articlesToInsert) {
            // Re-check just in case
            const { data: existingRes } = await supabase
                .from('news_articles')
                .select('id')
                .eq('title', article.title)
                .maybeSingle();

            if (!existingRes) {
                const { error: insertErr } = await supabase
                    .from('news_articles')
                    .insert({
                        source_id: article.source_id,
                        external_url: article.external_url,
                        title: article.title,
                        category: article.category,
                        is_hot: article.is_hot,
                        published_at: String(article.published_at)
                    });

                if (insertErr) {
                    diagnosticLogs.push(`Failed to insert ${article.title}: ${insertErr.message}`);
                } else {
                    insertedCount++;
                    diagnosticLogs.push(`Inserted [${article.category}]: ${article.title}`);
                }
            } else {
                diagnosticLogs.push(`Skipped duplicate (Final check): ${article.title}`);
            }
        }

        return NextResponse.json({
            success: true,
            inserted: insertedCount,
            total_processed: articlesToInsert.length,
            logs: diagnosticLogs
        });
    } catch (e: any) {
        console.error("Cron Error: ", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
