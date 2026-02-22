import React from "react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from "next/link";
import { Settings, Bookmark, Star, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // handled in middleware
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Saved Tools
    const { data: savedTools, error } = await supabase
        .from('saved_tools')
        .select(`
            id,
            tool_id,
            created_at,
            tools (
                id,
                name,
                tagline,
                slug,
                logo_url,
                website_url
            )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    const styles = {
        header: {
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 8,
            color: "var(--foreground)",
            fontFamily: "var(--font-display)"
        },
        subtitle: {
            fontSize: 16,
            color: "var(--muted)",
            marginBottom: 32
        },
        card: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: "var(--shadow-sm)"
        },
        cardHeader: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 24,
            color: "var(--foreground)"
        },
        toolGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16
        },
        toolCard: {
            padding: 16,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--background)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            textDecoration: "none",
            transition: "all 0.2s"
        },
        toolIcon: {
            width: 48,
            height: 48,
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--foreground)"
        },
        emptyState: {
            padding: 48,
            textAlign: "center" as const,
            background: "rgba(255,255,255,0.01)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
            color: "var(--muted)"
        },
        btn: {
            padding: "8px 16px",
            background: "var(--accent)",
            color: "#FFF",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            marginTop: 16
        }
    };

    return (
        <div>
            <h1 style={styles.header}>Welcome back.</h1>
            <p style={styles.subtitle}>Manage your saved AI tools and preferences.</p>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <Bookmark className="text-[var(--accent)]" />
                    Saved Tools
                </div>

                {(!savedTools || savedTools.length === 0) ? (
                    <div style={styles.emptyState}>
                        <Bookmark size={48} style={{ margin: "0 auto", marginBottom: 16, opacity: 0.2 }} />
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>No saved tools yet</h3>
                        <p>Explore the directory to find tools you want to save for later.</p>
                        <Link href="/" style={styles.btn}>
                            Explore Directory <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div style={styles.toolGrid}>
                        {savedTools.map((item: any) => {
                            const tool = item.tools;
                            if (!tool) return null;
                            return (
                                <Link key={item.id} href={`/tool/${tool.slug}`} style={styles.toolCard}>
                                    {tool.logo_url ? (
                                        <img src={tool.logo_url} alt={tool.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                                    ) : (
                                        <div style={styles.toolIcon}>
                                            {tool.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--foreground)", fontSize: 16, marginBottom: 4 }}>
                                            {tool.name}
                                        </div>
                                        <div style={{ fontSize: 13, color: "var(--muted)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {tool.tagline}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <Settings className="text-[var(--accent)]" />
                    Account Overview
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
                    <div>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Email</div>
                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{user?.email}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Account Status</div>
                        <div style={{ fontWeight: 600, color: "#10B981", display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }}></div> Active
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
