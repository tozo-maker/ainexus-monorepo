import { pool } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { getTools } from '@/app/actions';
import ToolCard from '@/components/ToolCard';
import SharedNavbar from '@/components/SharedNavbar';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Sparkles, Search } from 'lucide-react';

export async function generateStaticParams() {
    try {
        const { rows } = await pool.query('SELECT slug FROM categories');
        return rows.map((r: any) => ({ category: r.slug }));
    } catch (e) {
        console.warn("Could not generate static params for categories", e);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { category } = resolvedParams;

    const { rows } = await pool.query('SELECT name, description FROM categories WHERE slug = $1', [category]);

    if (rows.length === 0) {
        return { title: 'AI Tools | AINexus' };
    }

    const { name, description } = rows[0];

    return {
        title: `Best ${name} AI Tools - Compare Pricing & Features | AINexus`,
        description: description || `Discover and compare the best ${name} AI tools. Read reviews, check pricing, and find the perfect AI for your workflow.`,
        openGraph: {
            title: `Best ${name} AI Tools for 2026 | AINexus`,
            description: `A curated, up-to-date directory of ${name} AI tools. We track pricing, platforms, APIs, and community score.`,
            type: 'website',
        },
        twitter: {
            card: "summary_large_image",
            title: `Best ${name} AI Tools - Compare Pricing & Features | AINexus`,
            description: description || `Discover and compare the best ${name} AI tools. Read reviews, check pricing, and find the perfect AI for your workflow.`,
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = await params;
    const { category } = resolvedParams;

    // Fetch Category Info
    const catRes = await pool.query('SELECT id, name, description FROM categories WHERE slug = $1', [category]);

    if (catRes.rows.length === 0) {
        notFound();
    }

    const catData = catRes.rows[0];

    // Fetch Tools using the standardized action
    const toolsResult = await getTools({ category: catData.name, limit: 100 });
    const tools = toolsResult.tools || [];

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const styles = {
        app: { minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-sans), sans-serif", position: "relative" as const },
        container: { maxWidth: 1400, margin: "0 auto", padding: "80px 32px 120px", position: "relative" as const, zIndex: 1 },
        header: { textAlign: "center" as const, marginBottom: 80 },
        title: { fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-3px", color: "var(--foreground)", marginBottom: 24, lineHeight: 1, fontFamily: "var(--font-display)" },
        subtitle: { fontSize: 20, color: "var(--muted)", maxWidth: 650, margin: "0 auto", lineHeight: 1.7, fontWeight: 500 },
        grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 },
    };

    return (
        <div style={styles.app as any}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(79,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
            <SharedNavbar user={user} activeNav="categories" />

            <main style={styles.container as any}>
                <div style={{ marginBottom: 40 }}>
                    <Link href="/" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        <ChevronLeft size={16} /> Directory Terminal
                    </Link>
                </div>
                <div style={styles.header as any}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,70,229,0.1)", color: "var(--accent)", padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 24 }}>
                        <Sparkles size={14} />
                        Intelligence Category
                    </div>
                    <h1 style={styles.title as any}>{catData.name} Protocols</h1>
                    <p style={styles.subtitle as any}>
                        {catData.description || `Analyzing and categorizing the most advanced ${catData.name} neural networks and autonomous tools.`}
                    </p>
                </div>

                <div style={styles.grid as any}>
                    {tools.map((tool: any) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                        />
                    ))}

                    {tools.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "120px 20px", color: "var(--muted)" }}>
                            <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--border)" }}>
                                <Search size={40} />
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", marginBottom: 12 }}>No Data Found</div>
                            <div style={{ fontSize: 16, fontWeight: 500 }}>The directory expansion for this intelligence sector is currently offline.</div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
