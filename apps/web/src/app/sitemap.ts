import { MetadataRoute } from 'next'
import { pool } from '@/lib/db';

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://ainexus.dev'; // Replace with the actual domain later
    const routes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/ai-tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ];

    try {
        const { rows: tools } = await pool.query('SELECT slug, updated_at FROM tools');
        const { rows: categories } = await pool.query('SELECT slug FROM categories');

        const toolRoutes = tools.map((t: any) => ({
            url: `${baseUrl}/tool/${t.slug}`,
            lastModified: t.updated_at,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        const categoryRoutes = categories.map((c: any) => ({
            url: `${baseUrl}/ai-tools/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        const { rows: popularTools } = await pool.query('SELECT slug FROM tools ORDER BY avg_rating DESC LIMIT 20');
        const compareRoutes: MetadataRoute.Sitemap = [];
        for (let i = 0; i < popularTools.length; i++) {
            for (let j = i + 1; j < popularTools.length; j++) {
                compareRoutes.push({
                    url: `${baseUrl}/compare/${popularTools[i].slug}-vs-${popularTools[j].slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.6,
                });
            }
        }

        return [...routes, ...toolRoutes, ...categoryRoutes, ...compareRoutes];
    } catch (e) {
        console.warn("Failed to generate dynamic sitemap rules, skipping", e);
        return routes;
    }
}
