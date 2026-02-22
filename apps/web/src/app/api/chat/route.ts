
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
// Retrieval model
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
// Generation model
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // 1. Generate embedding for user query
        const embeddingResult = await embeddingModel.embedContent(message);
        const vector = embeddingResult.embedding.values;

        // 2. Retrieve relevant tools from DB (pgvector)
        // We fetch top 5 matches
        const vectorStr = `[${vector.join(',')}]`;
        const searchResult = await pool.query(
            `SELECT t.name, t.description, c.name as category, t.pricing_model, t.avg_rating 
       FROM tools t
       LEFT JOIN categories c ON t.category_id = c.id
       ORDER BY t.embedding <=> $1 ASC 
       LIMIT 5`,
            [vectorStr]
        );

        const contextTools = searchResult.rows.map((tool: any) =>
            `- ${tool.name} (${tool.category}, ${tool.pricing_model}, ${tool.avg_rating}★): ${tool.description}`
        ).join("\n");

        // 3. Construct Prompt for RAG
        const prompt = `
    You are an AI assistant for "AINeXus", a directory of AI tools. 
    Answer the user's question based ONLY on the following context about tools in our directory.
    If the answer is not in the context, say you don't know but suggest checking the directory visually.
    Be concise, helpful, and friendly.

    CONTEXT:
    ${contextTools}

    USER QUESTION:
    "${message}"
    `;

        // 4. Generate Answer
        const result = await chatModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
