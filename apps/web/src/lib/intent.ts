
import { GoogleGenerativeAI } from "@google/generative-ai";

// Cache intents to save API calls/latency
const intentCache = new Map<string, string>();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export type UI_INTENT = 'VIDEO' | 'CODE' | 'TEXT' | 'GENERAL';

export async function classifyIntent(query: string): Promise<UI_INTENT> {
    const q = query.trim().toLowerCase();
    if (!q) return 'GENERAL';
    if (intentCache.has(q)) return intentCache.get(q) as UI_INTENT;

    // Quick heuristic overrides for speed
    if (q.includes('video') || q.includes('movie') || q.includes('generate')) return 'VIDEO';
    if (q.includes('code') || q.includes('python') || q.includes('script') || q.includes('debug')) return 'CODE';
    if (q.includes('write') || q.includes('blog') || q.includes('text')) return 'TEXT';

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Classify the user intent for a UI layout.
        Options: 
        - VIDEO (for video generation, editing, media)
        - CODE (for programming, debugging, IDE context)
        - TEXT (for writing, copywriting, chat)
        - GENERAL (for directories, discovery, or unclear)
        
        Query: "${query}"
        
        Respond with ONLY one word.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().toUpperCase().replace(/[^A-Z]/g, ''); // Clean up

        let intent: UI_INTENT = 'GENERAL';
        if (text.includes('VIDEO')) intent = 'VIDEO';
        else if (text.includes('CODE')) intent = 'CODE';
        else if (text.includes('TEXT')) intent = 'TEXT';

        intentCache.set(q, intent);
        return intent;
    } catch (e) {
        console.error("Intent classification failed:", e);
        return 'GENERAL';
    }
}
