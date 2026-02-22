const fs = require('fs');

async function extract() {
    console.log("Fetching JSON list...");
    const res = await fetch('https://raw.githubusercontent.com/lakey009/AI-Tools-List/main/AIToolsList.json');
    const data = await res.json();

    console.log(`Successfully fetched ${data.length} items.`);

    // Extract website property and filter out empty/null ones
    const urls = data
        .map(item => item.website)
        .filter(url => url && url.startsWith('http'))
        .map(url => url.trim());

    // Deduplicate
    const uniqueUrls = [...new Set(urls)];

    console.log(`Extracted ${uniqueUrls.length} unique valid URLs.`);

    // Take 350 to ensure we hit the 300+ target even with some failures
    const targetUrls = uniqueUrls.slice(0, 350);

    fs.writeFileSync('seeds.txt', targetUrls.join('\n'));
    console.log("✅ Created seeds.txt with " + targetUrls.length + " URLs.");
}

extract().catch(console.error);
