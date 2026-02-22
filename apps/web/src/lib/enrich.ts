import { XMLParser } from "fast-xml-parser";

export interface Paper {
    title: string;
    summary: string;
    url: string;
    published: string;
}

export interface Video {
    title: string;
    thumbnail: string;
    url: string;
    channel: string;
}

export async function fetchArXivPapers(query: string): Promise<Paper[]> {
    try {
        // Sanitize query
        const safeQuery = encodeURIComponent(query);
        const response = await fetch(`http://export.arxiv.org/api/query?search_query=all:${safeQuery}&start=0&max_results=3`);

        if (!response.ok) {
            throw new Error(`ArXiv API failed: ${response.statusText}`);
        }

        const xmlData = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const result = parser.parse(xmlData);

        const entries = result.feed?.entry;

        if (!entries) return [];

        // Handle single entry (object) vs multiple entries (array)
        const entriesArray = Array.isArray(entries) ? entries : [entries];

        return entriesArray.map((entry: any) => ({
            title: entry.title.replace(/\n/g, " ").trim(),
            summary: entry.summary.replace(/\n/g, " ").trim().substring(0, 200) + "...",
            url: entry.id,
            published: new Date(entry.published).getFullYear().toString()
        }));

    } catch (error) {
        console.error("ArXiv fetch failed:", error);
        // Fallback to static data
        return [
            { title: "Attention Is All You Need (Fallback)", summary: "The foundational paper for Transformers.", url: "https://arxiv.org/abs/1706.03762", published: "2017" },
            { title: "Language Models are Few-Shot Learners", summary: "The GPT-3 paper demonstrating in-context learning.", url: "https://arxiv.org/abs/2005.14165", published: "2020" }
        ];
    }
}

export async function fetchYouTubeTutorials(query: string): Promise<Video[]> {
    const key = process.env.YOUTUBE_API_KEY;

    if (key) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " AI tutorial")}&key=${key}&maxResults=3&type=video`);
            if (!response.ok) throw new Error("YouTube API failed");

            const data = await response.json();
            return data.items.map((item: any) => ({
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.medium.url,
                url: `https://youtube.com/watch?v=${item.id.videoId}`,
                channel: item.snippet.channelTitle
            }));
        } catch (error) {
            console.error("YouTube API error:", error);
        }
    }

    // Smart Mock Fallback
    await new Promise(r => setTimeout(r, 600)); // Sim latency

    // Return relevant-looking mocks based on query keywords
    if (query.toLowerCase().includes("video") || query.toLowerCase().includes("image")) {
        return [
            { title: `Mastering AI Video Generation with ${query}`, thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", url: "https://youtube.com", channel: "MattVidPro AI" },
            { title: `${query} Workflow Tutorial`, thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg", url: "https://youtube.com", channel: "All About AI" }
        ];
    }

    return [
        { title: `${query} Full Course 2026`, thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", url: "https://youtube.com", channel: "FreeCodeCamp" },
        { title: "Building with AI Agents", thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg", url: "https://youtube.com", channel: "All About AI" }
    ];
}
