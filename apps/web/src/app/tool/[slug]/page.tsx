import { getToolBySlug, getSimilarTools, getToolPricingHistory } from "@/app/actions";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SharedNavbar from "@/components/SharedNavbar";

import SimilarTools from "@/components/SimilarTools";
import React, { Fragment } from "react";
import Link from "next/link";
import { Badge, StarRating, ToolLogo, RiskBadge } from "@/components/ToolCard";
import ReactMarkdown from "react-markdown";
import AgentSandbox from "@/components/AgentSandbox";
import ReviewForm from "@/components/ReviewForm";
import PricingHistory from "@/components/PricingHistory";
import { ChevronLeft, ExternalLink, Building, CheckCircle, Tag, Globe, MessageSquare, Activity, ShieldCheck, TrendingUp } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);

    if (!tool) {
        return {
            title: "Intelligence Not Found | AI Nexus",
            description: "The requested intelligence protocol could not be located in the directory."
        };
    }

    return {
        title: `${tool.name} | AI Nexus Intelligence`,
        description: tool.description?.slice(0, 160) || `Comprehensive analysis of ${tool.name} on AI Nexus.`,
        openGraph: {
            title: tool.name,
            description: tool.description?.slice(0, 160),
            images: tool.logo ? [{ url: tool.logo }] : [],
        }
    };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const tool = await getToolBySlug(slug);

    if (!tool) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
                <h1 style={{ fontWeight: 900, letterSpacing: "-2px", fontSize: 48, marginBottom: 24 }}>404_NOT_FOUND</h1>
                <Link href="/" style={{
                    color: "var(--accent)",
                    textDecoration: "none",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "rgba(202,138,4,0.05)"
                }}>
                    <ChevronLeft size={18} />
                    Return to Directory
                </Link>
            </div>
        );
    }

    const similarTools = await getSimilarTools(tool.id);
    const pricingHistory = await getToolPricingHistory(tool.id);

    const styles = {
        nav: {
            position: "sticky" as const, top: 0, zIndex: 100, background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
            padding: "0 32px", display: "flex", alignItems: "center", gap: 0, height: 64
        },
        logo: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--foreground)", marginRight: 48, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "var(--font-display)", textDecoration: "none" },
        logoAccent: { color: "var(--accent)" },
        navRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
        navBtn: { padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "var(--transition)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", boxShadow: "var(--shadow-sm)" },
        navBtnPrimary: { padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "var(--transition)", border: "none", background: "var(--accent)", color: "#FFF", boxShadow: "0 4px 6px -1px var(--accent-glow)", textDecoration: "none" },

        container: { maxWidth: 1920, width: "100%", margin: "0 auto", padding: "60px 32px 120px", boxSizing: "border-box" as const },
        header: { marginBottom: 60 },
        breadcrumb: {
            color: "var(--muted)",
            fontSize: 12,
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 600,
        },
        titleRow: { display: "flex", alignItems: "flex-start", gap: 40, marginBottom: 40 },
        toolLogoContainer: {
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "var(--background)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            flexShrink: 0,
            boxShadow: "var(--shadow-sm)"
        },
        title: { fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-2px", lineHeight: 1.1, margin: "12px 0", fontFamily: "var(--font-display)" },
        subtitle: { fontSize: 20, color: "var(--muted)", lineHeight: 1.7, maxWidth: 800, marginTop: 24, fontWeight: 400 },

        metaRow: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 0,
            marginTop: 60,
            border: "1px solid var(--border)",
            borderRadius: 16,
            background: "var(--background)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)"
        },
        metaItem: {
            padding: 32,
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column" as const,
            gap: 12
        },
        metaLabel: {
            fontSize: 12,
            color: "var(--muted)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
        },
        metaVal: { fontSize: 16, color: "var(--foreground)", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 },

        actionBtn: {
            padding: "16px 32px",
            borderRadius: 12,
            background: "var(--accent)",
            color: "#FFF",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontSize: 16,
            boxShadow: "0 4px 14px 0 var(--accent-glow)",
        },
        sectionTitle: { fontSize: 24, fontWeight: 800, color: "var(--foreground)", margin: 0, letterSpacing: "-0.5px", fontFamily: "var(--font-display)" }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-sans), sans-serif", position: "relative" }}>
            {/* Soft grid background matching AINexus */}
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(79,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

            <SharedNavbar user={user} />

            <div style={{ ...styles.container, position: "relative", zIndex: 1 }}>
                {/* Breadcrumb */}
                <div style={styles.breadcrumb}>
                    <Link href="/" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-accent">Directory</Link>
                    <ChevronLeft size={14} style={{ opacity: 0.5, transform: "rotate(180deg)" }} />
                    <span style={{ color: "var(--muted)" }}>{tool.category}</span>
                    <ChevronLeft size={14} style={{ opacity: 0.5, transform: "rotate(180deg)" }} />
                    <span style={{ color: "var(--foreground)" }}>{tool.name}</span>
                </div>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.titleRow}>
                        <div style={styles.toolLogoContainer}>
                            <ToolLogo tool={tool} style={{ width: "100%", height: "100%", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center" }} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <Badge text={tool.badge} />
                                {tool.featured && (!tool.badge || !tool.badge.includes('Trending')) && <Badge text="🔥 Trending" />}
                            </div>
                            <h1 style={styles.title}>{tool.name}</h1>
                            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 16, fontWeight: 500 }}>
                                    <Building size={16} />
                                    <span>Engineering by <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{tool.company}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.subtitle}>
                        <ReactMarkdown>
                            {tool.description}
                        </ReactMarkdown>
                    </div>

                    <div style={{ marginTop: 48, display: "flex", gap: 16 }}>
                        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" style={styles.actionBtn}>
                            Initialize Protocol
                            <ExternalLink size={20} />
                        </a>
                    </div>
                </div>

                {/* Metas */}
                <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                        <div style={styles.metaLabel}><Tag size={12} /> Pricing Model</div>
                        <div style={styles.metaVal}>
                            <div style={{ background: "rgba(79,70,229,0.1)", color: "var(--accent)", padding: "6px 14px", borderRadius: 8, fontSize: 14 }}>
                                {tool.price}
                            </div>
                        </div>
                    </div>
                    <div style={styles.metaItem}>
                        <div style={styles.metaLabel}><MessageSquare size={14} /> Intelligence Rating</div>
                        <div style={styles.metaVal}>
                            <StarRating rating={tool.rating} />
                            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>({tool.reviews} reviews)</span>
                        </div>
                    </div>
                    <div style={styles.metaItem}>
                        <div style={styles.metaLabel}><CheckCircle size={14} /> Capabilities</div>
                        <div style={styles.metaVal}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {tool.tags.map((t: string) => (
                                    <span key={t} style={{
                                        background: "var(--primary)",
                                        color: 'var(--muted)',
                                        padding: "4px 10px",
                                        borderRadius: 6,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        border: "1px solid var(--border)"
                                    }}>
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {tool.api && (
                        <div style={{ ...styles.metaItem, borderRight: "none" }}>
                            <div style={styles.metaLabel}><Globe size={14} /> API Access</div>
                            <div style={styles.metaVal}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10B981" }}>
                                    <CheckCircle size={18} />
                                    <span>Protocol Available</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Compliance & Governance */}
                {tool.eu_ai_act_risk_tier && (
                    <div style={{ marginTop: 100 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                            <div style={{ width: 4, height: 24, background: "var(--accent)", borderRadius: 2 }} />
                            <h2 style={styles.sectionTitle}>Compliance & Governance</h2>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                            {/* Score Card */}
                            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 12, boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>
                                    <Activity size={16} style={{ color: "var(--accent)" }} />
                                    OVERALL COMPLIANCE SCORE
                                </div>
                                <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "var(--font-display)", color: tool.compliance_score >= 80 ? "#10B981" : tool.compliance_score >= 50 ? "#F59E0B" : "#EF4444" }}>
                                    {tool.compliance_score}
                                    <span style={{ fontSize: 18, color: "var(--muted)", fontWeight: 500 }}>/100</span>
                                </div>
                            </div>

                            {/* Risk Tier & GDPR */}
                            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16, boxShadow: "var(--shadow-sm)" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                                        <ShieldCheck size={16} style={{ color: "var(--accent)" }} />
                                        EU AI ACT RISK TIER
                                    </div>
                                    <RiskBadge tier={tool.eu_ai_act_risk_tier} />
                                </div>
                                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
                                        <Globe size={16} style={{ color: "var(--accent)" }} />
                                        DATA GOVERNANCE
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: tool.gdpr_compliant ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: tool.gdpr_compliant ? "#10B981" : "#EF4444", border: `1px solid ${tool.gdpr_compliant ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                                            {tool.gdpr_compliant ? "✓ GDPR Compliant" : "✕ Non-Compliant"}
                                        </span>
                                        <span style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: tool.trains_on_user_data ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", color: tool.trains_on_user_data ? "#F59E0B" : "#10B981", border: `1px solid ${tool.trains_on_user_data ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}` }}>
                                            {tool.trains_on_user_data ? "Trains on User Data" : "No User Training"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Transparency & Governance */}
                            <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16, boxShadow: "var(--shadow-sm)" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>
                                            <TrendingUp size={16} style={{ color: "var(--accent)" }} />
                                            TRANSPARENCY INDEX
                                        </div>
                                        <span style={{ fontWeight: 800, color: "var(--foreground)" }}>{tool.transparency_index}%</span>
                                    </div>
                                    <div style={{ height: 6, background: "var(--primary)", borderRadius: 3, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${tool.transparency_index}%`, background: "var(--accent)", borderRadius: 3 }} />
                                    </div>
                                </div>
                                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                                        <CheckCircle size={16} style={{ color: "var(--accent)" }} />
                                        GOVERNANCE GRADE
                                    </div>
                                    <div style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
                                        Grade {tool.data_governance_grade}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Agent Sandbox */}
                <div style={{ marginTop: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                        <div style={{ width: 4, height: 24, background: "var(--accent)", borderRadius: 2 }} />
                        <h2 style={styles.sectionTitle}>Autonomous Interaction</h2>
                    </div>
                    <AgentSandbox toolUrl={tool.website_url} toolName={tool.name} />
                </div>

                {/* Pricing History */}
                <div style={{ marginTop: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                        <div style={{ width: 4, height: 24, background: "var(--accent)", borderRadius: 2 }} />
                        <h2 style={styles.sectionTitle}>Pricing & Feature Log</h2>
                    </div>
                    <PricingHistory history={pricingHistory} />
                </div>

                {/* Review Form */}
                <div style={{ marginTop: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                        <div style={{ width: 4, height: 24, background: "var(--accent)", borderRadius: 2 }} />
                        <h2 style={styles.sectionTitle}>Intelligence Feedback</h2>
                    </div>
                    <ReviewForm toolId={tool.id} />
                </div>

                {/* Similar Tools */}
                {similarTools.length > 0 && (
                    <div style={{ marginTop: 100 }}>
                        <SimilarTools tools={similarTools} />
                    </div>
                )}
            </div>
        </div>
    );
}
