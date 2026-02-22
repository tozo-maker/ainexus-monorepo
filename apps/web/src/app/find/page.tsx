"use client";

import React, { useState } from "react";
import SharedNavbar from "@/components/SharedNavbar";
import { Sparkles, ArrowRight, Loader2, MessageSquare, Bot } from "lucide-react";
import { getTools } from "@/app/actions";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

export default function IntentSearchPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [intentType, setIntentType] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    // Placeholder for auth state if needed, but not strictly required for public search
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const { tools, intent } = await getTools({ searchQuery: query, limit: 12 });
            setResults(tools);
            setIntentType(intent);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
            padding: "64px 24px",
            maxWidth: 1000,
            margin: "0 auto",
            width: "100%"
        },
        hero: {
            textAlign: "center" as const,
            marginBottom: 48,
            animation: "fade-in 0.5s ease-out"
        },
        title: {
            fontSize: 48,
            fontWeight: 800,
            color: "var(--foreground)",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em",
            marginBottom: 16
        },
        subtitle: {
            fontSize: 18,
            color: "var(--muted)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6
        },
        searchBox: {
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "8px 8px 8px 24px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
            maxWidth: 700,
            margin: "0 auto",
            transition: "box-shadow 0.3s, border-color 0.3s"
        },
        input: {
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 18,
            color: "var(--foreground)"
        },
        button: {
            background: "var(--foreground)",
            color: "var(--background)",
            border: "none",
            borderRadius: 20,
            padding: "16px 32px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "transform 0.1s"
        },
        resultsArea: {
            marginTop: 48,
            paddingTop: 48,
            borderTop: "1px solid var(--border)"
        },
        intentBadge: {
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(59, 130, 246, 0.1)",
            color: "#3B82F6",
            padding: "6px 16px",
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 24
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20
        },
        toolCard: {
            padding: 20,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)",
            textDecoration: "none",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column" as const
        }
    };

    return (
        <div style={styles.page}>
            <SharedNavbar activeNav="discover" />

            <main style={styles.container}>
                <div style={styles.hero}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", marginBottom: 24 }}>
                        <Bot size={32} />
                    </div>
                    <h1 style={styles.title}>Describe your task.</h1>
                    <p style={styles.subtitle}>
                        Don't know which AI tool you need? Just describe what you're trying to achieve in plain English, and our intent engine will find the perfect match.
                    </p>
                </div>

                <form onSubmit={handleSearch} style={styles.searchBox} className="focus-within:border-[var(--accent)] focus-within:shadow-xl">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. I need to generate realistic voiceovers for marketing videos..."
                        style={styles.input}
                        autoFocus
                    />
                    <button type="submit" disabled={loading || !query.trim()} style={{ ...styles.button, opacity: (loading || !query.trim()) ? 0.7 : 1 }}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        Find Tools
                    </button>
                </form>

                {searched && (
                    <div style={styles.resultsArea} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: 64, color: "var(--muted)" }}>
                                <Loader2 size={40} className="animate-spin mx-auto mb-4 opacity-50" />
                                <p>Analyzing your intent and scanning the database...</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--foreground)" }}>
                                        {results.length} Tools Found
                                    </h2>
                                    {intentType && intentType !== 'GENERAL' && (
                                        <div style={styles.intentBadge}>
                                            <Sparkles size={14} /> AI Detected Intent: {intentType}
                                        </div>
                                    )}
                                </div>

                                {results.length === 0 ? (
                                    <div style={{ padding: 64, textAlign: "center", border: "1px dashed var(--border)", borderRadius: 16 }}>
                                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-500 opacity-30" />
                                        <h3 style={{ fontSize: 18, color: "var(--foreground)", fontWeight: 600, marginBottom: 8 }}>No perfect matches found</h3>
                                        <p style={{ color: "var(--muted)" }}>Try describing your problem differently or using broader terms.</p>
                                    </div>
                                ) : (
                                    <div style={styles.grid}>
                                        {results.map((tool) => (
                                            <Link key={tool.id} href={`/tool/${tool.slug}`} style={styles.toolCard} className="hover:border-[var(--accent)] hover:shadow-lg group">
                                                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                                                    {tool.logo ? (
                                                        <img src={tool.logo} alt={tool.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", border: "1px solid var(--border)" }} />
                                                    ) : (
                                                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "var(--foreground)" }}>
                                                            {tool.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)" }}>{tool.name}</div>
                                                        <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>{tool.category || 'AI Tool'}</div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, flex: 1, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, overflow: "hidden", WebkitBoxOrient: "vertical" }}>
                                                    {tool.description || tool.tagline}
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{tool.price}</span>
                                                    <span style={{ color: "var(--accent)", opacity: 0, transform: "translateX(-10px)", transition: "all 0.2s" }} className="group-hover:opacity-100 group-hover:translate-x-0 flex items-center gap-1 text-sm font-semibold">
                                                        View <ArrowRight size={14} />
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
