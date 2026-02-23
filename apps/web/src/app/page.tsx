import { Metadata } from 'next';
import { getTools, getModels, getNews, getVideos, getHeroStats } from './actions';
import AINeXus from '@/components/AINexus';

export const metadata: Metadata = {
    title: 'AI Nexus - The Ultimate AI Tools & Models Directory',
    description: 'Discover the best AI tools, models, and news. Compare features, pricing, and performance in the world\'s most comprehensive AI directory.',
    openGraph: {
        title: 'AI Nexus | Discover & Compare AI Tools',
        description: 'The ultimate directory for AI enthusiasts and professionals.',
        type: 'website',
    }
};

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const query = (resolvedParams?.q as string) || "";

    const [toolsResult, models, news, videos, heroStats] = await Promise.all([
        getTools({ searchQuery: query, limit: 12 }), // Fixed to pass object as per current actions.ts
        getModels(),
        getNews(),
        getVideos(),
        getHeroStats()
    ]);

    const tools = toolsResult.tools || [];
    const intent = toolsResult.intent || 'GENERAL';

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <AINeXus initialTools={tools} initialModels={models} news={news} videos={videos} initialIntent={intent} user={user} initialHeroStats={heroStats} />;
}
