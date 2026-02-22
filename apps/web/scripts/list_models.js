
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // Hack to get instance, but actually we need the model manager
        // The SDK doesn't always expose listModels directly on the main class in older versions, 
        // but let's try assuming standard usage or just fetch via REST if SDK fails.

        // Actually, checking documentation or just trying a known working one is faster. 
        // But let's try the key verification.

        // Better approach: use the API directly via fetch to list models if SDK is obscure
        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (generateContent)`);
                }
            });
        } else {
            console.log("Error listing models:", data);
        }

    } catch (e) {
        console.error(e);
    }
}

listModels();
