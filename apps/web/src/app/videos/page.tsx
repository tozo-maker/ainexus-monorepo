import React from "react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SharedNavbar from "@/components/SharedNavbar";
import { Play, TrendingUp, Clock, Filter, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "AI Video Library | AINexus",
    description: "Curated YouTube tutorials, reviews, and guides for the top AI tools.",
};

function formatViews(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

export default async function VideosPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll() { }
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Videos
    const { data: videos, error } = await supabase
        .from('videos')
        .select(`
            id, title, view_count, category, published_at, youtube_url,
            channel:youtube_channels(name, avatar_url)
        `)
        .order('published_at', { ascending: false });

    const styles = {
        page: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
            background: "var(--background)",
            fontFamily: "var(--font-sans)"
        },
        container: {
            flex: 1,
            padding: "48px 24px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%"
        },
        header: {
            fontSize: 48,
            fontWeight: 800,
            marginBottom: 16,
            color: "var(--foreground)",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em"
        },
        subtitle: {
            fontSize: 18,
            color: "var(--muted)",
            marginBottom: 48,
            maxWidth: 600,
            lineHeight: 1.6
        },
        toolbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            gap: 16,
            flexWrap: "wrap" as const
        },
        searchBox: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "12px 16px",
            flex: 1,
            maxWidth: 400
        },
        filterBtn: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            color: "var(--foreground)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24
        },
        card: {
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            transition: "transform 0.2s, box-shadow 0.2s",
            textDecoration: "none",
            display: "flex",
            flexDirection: "column" as const,
            cursor: "pointer",
            position: "relative" as const,
            group: "video-card"
        },
        thumbnailArea: {
            width: "100%",
            aspectRatio: "16/9",
            background: "var(--border)",
            position: "relative" as const,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
        },
        playOverlay: {
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            opacity: 0,
            transition: "opacity 0.2s"
        },
        cardContent: {
            padding: 20,
            flex: 1,
            display: "flex",
            flexDirection: "column" as const,
            gap: 12
        },
        title: {
            fontSize: 16,
            fontWeight: 700,
            color: "var(--foreground)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden"
        },
        metaRow: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 13,
            color: "var(--muted)",
            marginTop: "auto"
        },
        channelInfo: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--foreground)"
        }
    };

    return (
        <div style={styles.page}>
            <SharedNavbar activeNav="discover" user={user} />

            <main style={styles.container}>
                <h1 style={styles.header}>Video Library</h1>
                <p style={styles.subtitle}>
                    Watch curated tutorials, deep-dives, and reviews of the top AI tools from our network of trusted creators.
                </p>

                <div style={styles.toolbar}>
                    <div style={styles.searchBox}>
                        <Search size={18} color="var(--muted)" />
                        <input
                            type="text"
                            placeholder="Search videos..."
                            style={{ background: "transparent", border: "none", color: "var(--foreground)", outline: "none", width: "100%", fontSize: 16 }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button style={styles.filterBtn}>
                            <TrendingUp size={16} className="text-[var(--accent)]" /> Trending
                        </button>
                        <button style={{ ...styles.filterBtn, opacity: 0.7 }}>
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div style={styles.grid}>
                    {videos?.map((video: any) => {
                        const channelName = Array.isArray(video.channel) ? video.channel[0]?.name : video.channel?.name;
                        const diffDays = Math.floor((Date.now() - new Date(video.published_at).getTime()) / (1000 * 60 * 60 * 24));

                        // Extract YouTube ID for high-res thumbnail
                        let videoId = "";
                        if (video.youtube_url) {
                            const match = video.youtube_url.match(/[?&]v=([^&]+)/) || video.youtube_url.match(/youtu\.be\/([^?]+)/);
                            if (match && match[1]) videoId = match[1];
                        }

                        return (
                            <a
                                key={video.id}
                                href={video.youtube_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.card}
                                className="group hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)]"
                            >
                                <div style={styles.thumbnailArea}>
                                    {videoId ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                            alt={video.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => {
                                                // Fallback to hqdefault if maxres isn't available
                                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                            }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: 48 }}>🎥</div>
                                    )}
                                    <div className="group-hover:opacity-100" style={styles.playOverlay}>
                                        <Play fill="white" size={24} />
                                    </div>
                                </div>
                                <div style={styles.cardContent}>
                                    <h3 style={styles.title}>{video.title}</h3>

                                    <div style={styles.channelInfo}>
                                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                                            {channelName?.charAt(0)}
                                        </div>
                                        {channelName || 'Unknown Creator'}
                                    </div>

                                    <div style={styles.metaRow}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <TrendingUp size={14} /> {formatViews(video.view_count)} views
                                        </span>
                                        <span>•</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <Clock size={14} /> {diffDays}d ago
                                        </span>
                                        {video.category && (
                                            <>
                                                <span>•</span>
                                                <span style={{ color: "var(--accent)", fontWeight: 500 }}>{video.category}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>

                {(!videos || videos.length === 0) && (
                    <div style={{ padding: 64, textAlign: "center", color: "var(--muted)", border: "1px dashed var(--border)", borderRadius: 16, marginTop: 48 }}>
                        <Play size={48} style={{ margin: "0 auto", marginBottom: 16, opacity: 0.2 }} />
                        <h3 style={{ fontSize: 20, color: "var(--foreground)", fontWeight: 600, marginBottom: 8 }}>No videos found</h3>
                        <p>We're currently indexing the latest AI tutorials. Check back soon.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
