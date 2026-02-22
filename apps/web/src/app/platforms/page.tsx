import React from "react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SharedNavbar from "@/components/SharedNavbar";
import { getModels } from "@/app/actions";
import { Server, Database, Activity, Code, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "AI Platforms & Models | AINexus",
    description: "Compare core foundational LLMs, vectors databases, and cloud APIs powering the AI ecosystem.",
};

export default async function PlatformsHub() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Fetch rich model data
    const models = await getModels();

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
        sectionTitle: {
            fontSize: 24,
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12
        },
        modelGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 24,
            marginBottom: 64
        },
        modelCard: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            transition: "all 0.2s",
            position: "relative" as const
        },
        modelHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20
        },
        modelName: {
            fontSize: 20,
            fontWeight: 700,
            color: "var(--foreground)"
        },
        companyTag: {
            fontSize: 13,
            color: "var(--muted)",
            marginTop: 4
        },
        arenaScore: {
            background: "var(--accent)",
            color: "#FFF",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 4
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20
        },
        statBox: {
            background: "rgba(0,0,0,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 12
        },
        statLabel: {
            fontSize: 11,
            textTransform: "uppercase" as const,
            letterSpacing: 0.5,
            color: "var(--muted)",
            marginBottom: 4,
            fontWeight: 600
        },
        statValue: {
            fontSize: 15,
            fontWeight: 600,
            color: "var(--foreground)"
        },
        priceRow: {
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            fontSize: 13,
            color: "var(--muted)"
        }
    };

    return (
        <div style={styles.page}>
            <SharedNavbar activeNav="discover" user={user} />

            <main style={styles.container}>
                <h1 style={styles.header}>Platforms Hub</h1>
                <p style={styles.subtitle}>
                    Explore the foundational layer of AI. Compare state-of-the-art Large Language Models (LLMs), Cloud APIs, and Vector Databases powering the nexus.
                </p>

                {/* Section 1: Top Language Models */}
                <h2 style={styles.sectionTitle}>
                    <Zap className="text-[var(--accent)]" /> Foundation Models (LLMs)
                </h2>
                <div style={styles.modelGrid}>
                    {models.map((m: any) => (
                        <div key={m.id} style={styles.modelCard} className="hover:border-[var(--accent)] hover:shadow-lg">
                            <div style={styles.modelHeader}>
                                <div>
                                    <div style={styles.modelName}>{m.name}</div>
                                    <div style={styles.companyTag}>by {m.company || 'Unknown'}</div>
                                </div>
                                <div style={styles.arenaScore}>
                                    Arena: {m.arena}
                                </div>
                            </div>

                            <div style={styles.statsGrid}>
                                <div style={styles.statBox}>
                                    <div style={styles.statLabel}>Context Window</div>
                                    <div style={styles.statValue}>{m.context}</div>
                                </div>
                                <div style={styles.statBox}>
                                    <div style={styles.statLabel}>MMLU Score</div>
                                    <div style={styles.statValue}>{m.mmlu}%</div>
                                </div>
                            </div>

                            <div style={styles.priceRow}>
                                <div>
                                    <strong style={{ color: "var(--foreground)" }}>${m.price_in}</strong> / 1M input
                                </div>
                                <div>
                                    <strong style={{ color: "var(--foreground)" }}>${m.price_out}</strong> / 1M output
                                </div>
                            </div>

                            {m.opensource && (
                                <div style={{ position: "absolute", top: -12, left: 24, background: "#10B981", color: "#FFF", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Open Source
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Section 2: Infrastructure (Placeholder mapping) */}
                <h2 style={styles.sectionTitle}>
                    <Server className="text-gray-400" /> Cloud APIs & Infrastructure
                </h2>
                <div style={{ padding: 48, textAlign: "center", border: "1px dashed var(--border)", borderRadius: 16, background: "rgba(255,255,255,0.01)" }}>
                    <Database size={48} className="text-gray-300 mx-auto mb-4 opacity-50" />
                    <h3 style={{ fontSize: 20, color: "var(--foreground)", fontWeight: 600, marginBottom: 8 }}>Vector DBs & Cloud Architecture</h3>
                    <p style={{ color: "var(--muted)", maxWidth: 500, margin: "0 auto" }}>We are currently rolling out structured comparison tables for Vector Databases (Pinecone, Weaviate, Milvus) and MLOps platforms.</p>
                </div>
            </main>
        </div>
    );
}
