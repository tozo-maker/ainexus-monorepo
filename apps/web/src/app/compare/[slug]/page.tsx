import { pool } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { Badge, StarRating, ToolLogo } from '@/components/ToolCard';
import SharedNavbar from '@/components/SharedNavbar';
import { createClient } from '@/lib/supabase/server';
import { Globe, ChevronLeft, Columns, Activity, CheckCircle2, XCircle, Cpu, ShieldCheck, Zap } from 'lucide-react';

export async function generateStaticParams() {
    // For SEO purposes, we can pre-build popular combinations
    try {
        const { rows } = await pool.query('SELECT slug FROM tools ORDER BY weekly_views DESC LIMIT 20');

        const params = [];
        for (let i = 0; i < rows.length; i++) {
            for (let j = i + 1; j < rows.length; j++) {
                params.push({ slug: `${rows[i].slug}-vs-${rows[j].slug}` });
            }
        }
        return params;
    } catch (e) {
        console.warn("Could not generate static params for compare pairs", e);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const targetSlug = resolvedParams.slug;
    const slugs = targetSlug.split('-vs-');

    if (slugs.length !== 2) {
        return {
            title: 'Compare Intelligence Protocols | AI Nexus',
            description: 'Side-by-side analysis of neural network protocols and autonomous tools.'
        };
    }

    const { rows } = await pool.query('SELECT name FROM tools WHERE slug = ANY($1)', [[slugs[0], slugs[1]]]);

    if (rows.length !== 2) {
        return { title: 'Compare AI Tools | AI Nexus' };
    }

    const name1 = rows.find((r: any) => r.name.toLowerCase() === slugs[0].replace(/-/g, ' '))?.name || rows[0].name;
    const name2 = rows.find((r: any) => r.name !== name1)?.name || rows[1].name;

    return {
        title: `${name1} vs ${name2} | Intelligence Comparison | AI Nexus`,
        description: `Objective, side-by-side comparison of ${name1} and ${name2}. Discover which AI tool is best for your specific use cases, comparing pricing, APIs, platforms, and features.`,
        openGraph: {
            title: `${name1} vs ${name2} Comparison | AINexus`,
            description: `Comparing architecture, API access, and capabilities between ${name1} and ${name2}.`,
            type: 'article',
        },
        twitter: {
            card: "summary_large_image",
            title: `${name1} vs ${name2} | Intelligence Comparison | AI Nexus`,
            description: `Objective, side-by-side comparison of ${name1} and ${name2}. Discover which AI tool is best for your specific use cases.`,
        }
    };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const targetSlug = resolvedParams.slug;
    const slugs = targetSlug.split('-vs-');

    if (slugs.length !== 2) {
        notFound();
    }

    const { rows } = await pool.query(`
        SELECT t.*, c.name as category_name, comp.name as company_name 
        FROM tools t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN companies comp ON t.company_id = comp.id
        WHERE t.slug = ANY($1)
    `, [[slugs[0], slugs[1]]]);

    if (rows.length !== 2) {
        notFound();
    }

    // Ensure tool1 is the first slug in the URL and tool2 is the second
    const tool1 = rows.find((r: any) => r.slug === slugs[0]);
    const tool2 = rows.find((r: any) => r.slug === slugs[1]);

    if (!tool1 || !tool2) {
        notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const styles = {
        app: { minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-sans), sans-serif", position: "relative" as const },
        container: { maxWidth: 1200, margin: "0 auto", padding: "80px 32px 120px", position: "relative" as const, zIndex: 1 },
        header: { textAlign: "center" as const, marginBottom: 80 },
        title: { fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-3px", color: "var(--foreground)", marginBottom: 24, lineHeight: 1, fontFamily: "var(--font-display)" },
        subtitle: { fontSize: 20, color: "var(--muted)", maxWidth: 700, margin: "0 auto", lineHeight: 1.7, fontWeight: 500 },

        compareGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, position: "relative" as const },
        vsBadge: {
            position: "absolute" as const,
            left: "50%",
            top: 60,
            transform: "translate(-50%, -50%)",
            padding: "8px 16px",
            borderRadius: 12,
            background: "var(--background)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            fontWeight: 900,
            fontSize: 12,
            zIndex: 10,
            boxShadow: "var(--shadow-sm)",
            letterSpacing: "2px",
        },

        toolColumn: { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
        toolHeader: { padding: 48, textAlign: "center" as const, borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.02)" },
        toolLogo: { width: 96, height: 96, borderRadius: 24, background: "var(--background)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" },
        toolName: { fontSize: 28, fontWeight: 900, color: "var(--foreground)", marginBottom: 8, letterSpacing: "-1px" },
        toolCompany: { fontSize: 13, color: "var(--muted)", fontWeight: 800, marginBottom: 20, textTransform: "uppercase", letterSpacing: "1px" },

        row: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "32px 40px", borderBottom: "1px solid var(--border)", minHeight: 120, textAlign: "center" as const },
        rowLabel: { fontSize: 10, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
        rowValue: { fontSize: 15, color: "var(--foreground)", fontWeight: 600, lineHeight: 1.6 },

        priceVal: (price: string) => ({
            fontSize: 14, fontWeight: 900, letterSpacing: "0.5px", textTransform: "uppercase",
            color: price?.toLowerCase() === "free" ? "#10B981" : "var(--accent)",
            background: price?.toLowerCase() === "free" ? "rgba(16,185,129,0.1)" : "rgba(79,70,229,0.1)",
            padding: "6px 14px",
            borderRadius: 8
        }),

        tagList: { display: "flex", flexWrap: "wrap" as const, gap: 8, justifyContent: "center" },
        tag: { padding: "4px 10px", background: "var(--primary)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--muted)", fontWeight: 700 },

        ctaContainer: { padding: 40, textAlign: "center" as const, background: "rgba(0,0,0,0.02)" },
        ctaBtn: {
            display: "inline-block",
            padding: "16px 32px",
            background: "var(--accent)",
            color: "#FFF",
            textDecoration: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 14px 0 var(--accent-glow)"
        }
    };

    const renderFeature = (tool: any) => (
        <>
            <div style={styles.toolHeader}>
                <div style={styles.toolLogo}>
                    <ToolLogo tool={tool} style={{ width: '100%', height: '100%', borderRadius: 24 }} />
                </div>
                <div style={styles.toolName}>{tool.name}</div>
                <div style={styles.toolCompany}>{tool.company_name || 'Autonomous Protocol'}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                    <Badge text={tool.editor_badge} />
                    {tool.featured && <Badge text="🔥 Trending" />}
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.rowLabel}><Activity size={12} /> Capabilities</div>
                <div style={styles.rowValue}>{tool.description}</div>
            </div>

            <div style={styles.row}>
                <div style={styles.rowLabel}><Zap size={12} /> Pricing Structure</div>
                <div style={styles.rowValue}>
                    <span style={styles.priceVal(tool.pricing_model || 'Standard')}>{tool.pricing_model || 'Enterprise'}</span>
                    {tool.has_free_tier && (
                        <div style={{ fontSize: 11, color: "#10B981", marginTop: 12, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontWeight: 800 }}>
                            <CheckCircle2 size={12} /> FREE VERSION AVAILABLE
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.rowLabel}><Columns size={12} /> Domain Sector</div>
                <div style={styles.rowValue}>
                    <span style={{ color: "var(--accent)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px" }}>{tool.category_name || 'General Intelligence'}</span>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.rowLabel}><ShieldCheck size={12} /> Reliability Index</div>
                <div style={styles.rowValue}>
                    <div style={{ transform: "scale(1.2)", marginBottom: 8 }}>
                        <StarRating rating={Number(tool.avg_rating) || 0} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>VERIFIED BY {tool.review_count || 0} NODES</div>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.rowLabel}><Cpu size={12} /> System Specs</div>
                <div style={styles.rowValue}>
                    <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: tool.has_api ? "#10B981" : "var(--border)", fontWeight: 800, fontSize: 12 }}>
                            {tool.has_api ? <CheckCircle2 size={14} /> : <XCircle size={14} />} API SUPPORT
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: tool.is_open_source ? "#10B981" : "var(--border)", fontWeight: 800, fontSize: 12 }}>
                            {tool.is_open_source ? <CheckCircle2 size={14} /> : <XCircle size={14} />} OPEN SOURCE
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.rowLabel}><Globe size={12} /> OS Compatibility</div>
                <div style={styles.rowValue}>
                    {tool.platforms && tool.platforms.length > 0 ? (
                        <div style={styles.tagList}>
                            {tool.platforms.map((p: string) => <span key={p} style={styles.tag}>{p}</span>)}
                        </div>
                    ) : (
                        <span style={{ color: "var(--muted)", fontWeight: 700, fontSize: 12 }}>CLOUD TERMINAL ONLY</span>
                    )}
                </div>
            </div>

            <div style={{ ...styles.row, borderBottom: "none" }}>
                <div style={styles.rowLabel}>Interaction Tags</div>
                <div style={styles.rowValue}>
                    {tool.tags && tool.tags.length > 0 ? (
                        <div style={styles.tagList}>
                            {tool.tags.slice(0, 5).map((t: string) => <span key={t} style={styles.tag}>#{t}</span>)}
                        </div>
                    ) : (
                        <span style={{ color: "var(--muted)" }}>NO_METADATA</span>
                    )}
                </div>
            </div>

            <div style={styles.ctaContainer}>
                <a href={tool.website_url || '#'} target="_blank" rel="noopener noreferrer" style={styles.ctaBtn as any}>
                    Launch Protocol
                </a>
            </div>
        </>
    );

    return (
        <div style={styles.app as any}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(79,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

            <SharedNavbar user={user} />

            <main style={styles.container as any}>
                <div style={{ marginBottom: 40 }}>
                    <Link href="/" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        <ChevronLeft size={16} /> Directory Terminal
                    </Link>
                </div>
                <div style={styles.header as any}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(79,70,229,0.1)", border: "1px solid var(--border)", padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 800, color: "var(--accent)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 32 }}>
                        SIDE_BY_SIDE_ANALYSIS
                    </div>
                    <h1 style={styles.title as any}>{tool1.name} <span style={{ color: "var(--border)", fontWeight: 200, fontSize: "0.8em" }}>/</span> {tool2.name}</h1>
                    <p style={styles.subtitle as any}>
                        Deconstructing neural architectures and capability matrices. A high-fidelity comparison between {tool1.name} and {tool2.name}.
                    </p>
                </div>

                <div style={styles.compareGrid as any}>
                    <div style={styles.vsBadge as any}>CROSSOVER</div>

                    <div style={{ ...styles.toolColumn, borderLeftColor: "var(--accent)" }}>
                        {renderFeature(tool1)}
                    </div>

                    <div style={{ ...styles.toolColumn, borderLeftColor: "var(--accent)" }}>
                        {renderFeature(tool2)}
                    </div>
                </div>
            </main>
        </div>
    );
}
