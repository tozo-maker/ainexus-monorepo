const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env' });

async function list() {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("No API KEY");
        return;
    }

    // We can't easily list models via the high-level SDK unless we use the REST API manually or specific method?
    // Actually, the SDK doesn't expose listModels directly on the main class in some versions.
    // Let's try to just hit the API endpoint using fetch to be sure.

    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("Error:", data);
        }
    } catch (e) {
        console.error(e);
    }
}

list();
