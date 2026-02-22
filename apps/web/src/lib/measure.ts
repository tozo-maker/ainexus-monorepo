import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Initialize clients (safely)
const genAI = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
    : null;

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

export async function measureGemini() {
    if (!genAI) return null;
    const start = performance.now();
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, acknowledge this message with one word: 'Received'.");
        const response = await result.response;
        const text = response.text();
        const end = performance.now();
        const latency = Math.round(end - start);
        const tps = parseFloat((text.length / 4 / (latency / 1000)).toFixed(2));

        return {
            model_name: "Gemini 1.5 Pro",
            latency_ms: latency,
            tokens_per_second: tps > 0 ? tps : 0
        };
    } catch (error) {
        console.error("Gemini measurement failed:", error);
        return null;
    }
}

async function measureOpenAI() {
    if (!openai) return null;
    const start = performance.now();
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: "Hello, one word reply: 'Received'." }],
            max_tokens: 5
        });
        const end = performance.now();
        const latency = Math.round(end - start);
        const text = completion.choices[0].message.content || "";
        const tps = parseFloat((text.length / 4 / (latency / 1000)).toFixed(2));

        return {
            model_name: "GPT-4o",
            latency_ms: latency,
            tokens_per_second: tps > 0 ? tps : 0
        };
    } catch (error) {
        console.error("OpenAI measurement failed:", error);
        return null;
    }
}

async function measureAnthropic() {
    if (!anthropic) return null;
    const start = performance.now();
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 5,
            messages: [{ role: "user", content: "Hello, one word reply: 'Received'." }]
        });
        const end = performance.now();
        const latency = Math.round(end - start);
        // @ts-ignore - ContentBlock types are tricky
        const text = message.content[0]?.text || "";
        const tps = parseFloat((text.length / 4 / (latency / 1000)).toFixed(2));

        return {
            model_name: "Claude 3.5 Sonnet",
            latency_ms: latency,
            tokens_per_second: tps > 0 ? tps : 0
        };
    } catch (error) {
        console.error("Anthropic measurement failed:", error);
        return null; // Fallback will pick this up
    }
}

export async function measureOthers() {
    // Try real measurements first
    const realOpenAI = await measureOpenAI();
    const realAnthropic = await measureAnthropic();

    const results = [];

    // GPT-4o: Real or Simulated
    if (realOpenAI) {
        results.push(realOpenAI);
    } else {
        // Fallback Simulation
        results.push({
            model_name: "GPT-4o (Simulated)",
            latency_ms: Math.round(450 + (Math.random() * 100 - 50)),
            tokens_per_second: parseFloat((50 + (Math.random() * 10 - 5)).toFixed(2))
        });
    }

    // Claude: Real or Simulated
    if (realAnthropic) {
        results.push(realAnthropic);
    } else {
        // Fallback Simulation
        results.push({
            model_name: "Claude 3.5 Sonnet (Simulated)",
            latency_ms: Math.round(380 + (Math.random() * 80 - 40)),
            tokens_per_second: parseFloat((65 + (Math.random() * 15 - 7)).toFixed(2))
        });
    }

    return results;
}
