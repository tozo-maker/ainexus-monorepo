const { XMLParser } = require('fast-xml-parser');
async function test() {
    const feed = 'https://techcrunch.com/feed/';
    const response = await fetch(feed);
    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const json = parser.parse(xml);
    console.log("Root keys:", Object.keys(json));
    if (json.rss) {
        console.log("RSS Keys:", Object.keys(json.rss));
        if (json.rss.channel) {
            console.log("Channel Keys:", Object.keys(json.rss.channel));
            console.log("Has item?", !!json.rss.channel.item);
        }
    }
}
test();
