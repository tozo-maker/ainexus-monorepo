const { execSync } = require('child_process');

const TOOLS_TO_IMPORT = [
    "https://www.midjourney.com",
    "https://openai.com/chatgpt",
    "https://claude.ai",
    "https://runwayml.com",
    "https://stability.ai",
    "https://www.perplexity.ai",
    "https://huggingface.co",
    "https://replicate.com",
    "https://elevenlabs.io",
    "https://gamma.app",
    "https://tome.app",
    "https://beautiful.ai",
    "https://synthesia.io",
    "https://descript.com",
    "https://copy.ai",
    "https://writesonic.com",
    "https://otter.ai",
    "https://fireflies.ai",
    "https://framer.com",
    "https://webflow.com"
];

async function main() {
    console.log(`Starting batch import of ${TOOLS_TO_IMPORT.length} tools...`);

    for (const url of TOOLS_TO_IMPORT) {
        console.log(`\n-----------------------------------`);
        console.log(`Processing: ${url}`);
        try {
            // Run structure: include environment variables if any special ones needed
            // But .env is loaded by the script itself.
            execSync(`node scripts/enrich-tool.js ${url}`, { stdio: 'inherit' });

            // Sleep a bit to be nice to APIs and target sites
            await new Promise(r => setTimeout(r, 2000));

        } catch (e) {
            console.error(`Failed to process ${url}:`, e.message);
            // Continue to next
        }
    }
    console.log("\nBatch import complete.");
}

main();
