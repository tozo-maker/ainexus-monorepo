"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation to detail page
import ReactMarkdown from "react-markdown";

// ============================================================
// SUB-COMPONENTS
// ============================================================
import {
    Star,
    Zap,
    Repeat,
    Heart,
    Share2,
    ExternalLink,
    CheckCircle2,
    Globe,
    Cpu,
    ShieldCheck,
    TrendingUp,
    LayoutGrid,
    XCircle,
    Activity,
    Twitter,
    Github,
    Linkedin,
    MessageCircle,
    Image as ImageIcon,
    MessageSquare,
    Code2,
    Mic2,
    Video as VideoIcon,
    PenTool,
    Search as SearchIcon,
    Megaphone,
    BarChart,
    Database,
    Eye
} from 'lucide-react';

const CategoryIcon = ({ category, size = 12 }: { category: string, size?: number }) => {
    const cats: Record<string, any> = {
        "LLM Chat": <MessageSquare size={size} />,
        "Image Generation": <ImageIcon size={size} />,
        "Code Assistant": <Code2 size={size} />,
        "Audio AI": <Mic2 size={size} />,
        "Video AI": <VideoIcon size={size} />,
        "Writing": <PenTool size={size} />,
        "Research": <SearchIcon size={size} />,
        "Marketing": <Megaphone size={size} />,
        "Productivity": <BarChart size={size} />
    };
    return cats[category] || <Zap size={size} />;
};

export const StarRating = ({ rating }: { rating: number }) => {
    const full = Math.floor(rating);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ display: "flex", color: "var(--accent)" }}>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={12}
                        fill={i < full ? "var(--accent)" : "none"}
                        strokeWidth={2.5}
                        opacity={i < full ? 1 : 0.2}
                    />
                ))}
            </div>
            <span style={{ color: "var(--foreground)", marginLeft: 6, fontSize: "12px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>{rating}</span>
        </div>
    );
};

const SignalStrength = ({ value, label }: { value: number, label: string }) => {
    if (!value) return null;
    return (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column" as const, gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--muted)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Activity size={10} /> {label}</span>
                <span style={{ color: "var(--accent)" }}>{value}%</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
                {[...Array(12)].map((_, i) => {
                    const isActive = (i / 11) * 100 <= value;
                    const height = 4 + (i * 1.2);
                    return (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                height: `${height}px`,
                                background: isActive ? "var(--accent)" : "rgba(255,255,255,0.05)",
                                borderRadius: 1,
                                boxShadow: isActive ? "0 0 10px var(--accent-glow)" : "none",
                                opacity: isActive ? 1 : 0.4,
                                transition: "all 0.3s ease"
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const SocialLinks = ({ tool }: { tool: any }) => {
    const links = [
        { url: tool.twitter_url, icon: <Twitter size={14} /> },
        { url: tool.github_url, icon: <Github size={14} /> },
        { url: tool.linkedin_url, icon: <Linkedin size={14} /> },
        { url: tool.discord_url, icon: <MessageCircle size={14} /> },
    ].filter(l => l.url);

    if (links.length === 0) return null;

    return (
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {links.map((l, i) => (
                <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        color: "var(--muted)",
                        textDecoration: "none",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 12,
                        background: "var(--ai-surface-bright)",
                        border: "1px solid var(--border)",
                        transition: "var(--transition)"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--accent)";
                        e.currentTarget.style.borderColor = "var(--accent-glow)";
                        e.currentTarget.style.background = "rgba(234, 179, 8, 0.05)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--muted)";
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background = "var(--ai-surface-bright)";
                        e.currentTarget.style.transform = "none";
                    }}
                >
                    {l.icon}
                </a>
            ))}
        </div>
    );
};

export const Badge = ({ text }: { text: string | null }) => {
    if (!text) return null;
    const colors: Record<string, { bg: string; color: string; border: string }> = {
        "Most Popular": { bg: "var(--primary)", color: "var(--foreground)", border: "var(--border)" },
        "Editor's Pick": { bg: "var(--primary)", color: "var(--foreground)", border: "var(--border)" },
        "Top Rated": { bg: "var(--primary)", color: "var(--foreground)", border: "var(--border)" },
        "🔥 Trending": { bg: "rgba(79,70,229,0.1)", color: "var(--accent)", border: "transparent" },
        "Open Source": { bg: "var(--primary)", color: "var(--muted)", border: "var(--border)" },
        "New": { bg: "var(--primary)", color: "var(--foreground)", border: "var(--border)" },
    };
    const c = colors[text] || { bg: "var(--primary)", color: "var(--muted)", border: "var(--border)" };
    return (
        <span style={{
            background: c.bg,
            color: c.color,
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: "11px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 5
        }}>
            {text.includes("🔥") && <Zap size={10} fill="var(--accent)" stroke="none" />}
            {text.replace("🔥 ", "")}
        </span>
    );
};

export const RiskBadge = ({ tier }: { tier: string | null }) => {
    if (!tier || tier === 'Unclassified') return null;

    let color = "";
    let icon = <ShieldCheck size={10} />;

    switch (tier.toLowerCase()) {
        case 'minimal': color = "#10B981"; break;
        case 'limited': color = "#F59E0B"; break;
        case 'high': color = "#EF4444"; icon = <Zap size={10} />; break;
        case 'unacceptable': color = "#991B1B"; icon = <XCircle size={10} />; break;
        default: return null;
    }

    return (
        <span style={{
            color,
            border: `1px solid ${color}40`,
            background: `${color}10`,
            borderRadius: 6,
            padding: "4px 8px",
            fontSize: "11px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 5
        }}>
            {icon}
            {tier} Risk
        </span>
    );
};

// ============================================================
// STYLES
// ============================================================
export const ToolLogo = ({ tool, style }: { tool: any, style: any }) => {
    const [error, setError] = useState(false);

    if (tool.logo && !error) {
        return <div style={style}><img src={tool.logo} alt={tool.name} style={{ width: '100%', height: '100%', borderRadius: style.borderRadius || 12, objectFit: 'cover', background: "white" }} onError={() => setError(true)} /></div>;
    }

    return <div style={style}>🔧</div>;
};

const styles = {
    toolCard: (hovered: boolean, inCompare: boolean) => ({
        background: "var(--background)",
        border: `1px solid ${inCompare ? "var(--accent)" : hovered ? "var(--muted)" : "var(--border)"}`,
        borderRadius: 20,
        padding: "24px",
        cursor: "pointer",
        transition: "var(--transition)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        position: "relative" as const,
        overflow: "hidden",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column" as const,
        minHeight: 380
    }),
    toolHeader: { display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 },
    toolLogo: { width: 56, height: 56, borderRadius: 12, background: "var(--primary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, overflow: "hidden" },
    toolName: { fontSize: 18, fontWeight: 700, color: "var(--foreground)", marginBottom: 4, letterSpacing: "-0.5px", fontFamily: "var(--font-display)" },
    toolCompany: { fontSize: 13, color: "var(--muted)", fontWeight: 500, fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 6 },
    toolDesc: {
        fontSize: 14,
        color: "var(--muted)",
        lineHeight: 1.6,
        marginBottom: 20,
        fontFamily: "var(--font-sans)",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical" as const,
        overflow: "hidden",
        height: "4.8em"
    },
    toolTags: { display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 20 },
    tag: {
        padding: "4px 10px",
        background: "var(--primary)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        fontSize: 12,
        color: "var(--muted)",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 6
    },
    toolFooter: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        borderTop: "1px solid var(--border)",
        paddingTop: 20,
        marginTop: "auto"
    },
    priceTag: (price: string) => ({
        fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" as const,
        color: price.toLowerCase().includes("free") ? "#10B981" : price.toLowerCase().includes("freemium") ? "var(--accent)" : "#F59E0B",
        background: "var(--primary)",
        padding: "4px 10px",
        borderRadius: 6,
        border: "1px solid var(--border)"
    }),
    toolActions: { display: "flex", gap: 8 },
    iconBtn: (active: boolean) => ({
        width: 36, height: 36, borderRadius: 8,
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        background: active ? "rgba(79,70,229,0.1)" : "var(--primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "var(--transition)",
        color: active ? "var(--accent)" : "var(--muted)",
        boxShadow: "var(--shadow-sm)"
    }),
    trendBadge: (weekly: string) => {
        const pct = parseInt(weekly?.replace('%', '') || '0');
        return { fontSize: 11, fontWeight: 700, color: pct >= 20 ? "#10B981" : pct >= 10 ? "var(--accent)" : "var(--muted)" };
    },
};

interface ToolCardProps {
    tool: any;
    isHovered?: boolean;
    inCompare?: boolean;
    isSaved?: boolean;
    onToggleSave?: (id: string) => void;
    onToggleCompare?: (tool: any) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function ToolCard({ tool, inCompare, isSaved, onToggleSave, onToggleCompare }: ToolCardProps) {
    const [localHover, setLocalHover] = useState(false);
    const hovered = localHover;
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/tool/${tool.slug}`);
    };

    return (
        <div
            style={styles.toolCard(hovered, !!inCompare)}
            onMouseEnter={() => setLocalHover(true)}
            onMouseLeave={() => setLocalHover(false)}
            onClick={handleCardClick}
        >
            {/* AI Pattern Background for featured */}
            {tool.featured && (
                <div style={{ position: "absolute", inset: 0, opacity: 0.1, pointerEvents: "none", background: "radial-gradient(circle at top right, var(--accent), transparent 70%)" }} />
            )}

            <div style={styles.toolHeader}>
                <div style={styles.toolLogo}>
                    <ToolLogo tool={tool} style={{ width: "100%", height: "100%", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={styles.toolName}>{tool.name}</span>
                        {tool.is_verified && (
                            <div title="Verified Intelligence" style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}>
                                <CheckCircle2 size={18} fill="var(--accent)" stroke="#000" strokeWidth={2} />
                            </div>
                        )}
                        <Badge text={tool.badge} />
                        <RiskBadge tier={tool.eu_ai_act_risk_tier} />
                        {tool.gdpr_compliant && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle2 size={10} /> GDPR
                            </span>
                        )}
                        {tool.trains_on_user_data && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                                <Database size={10} /> Trains Data
                            </span>
                        )}
                    </div>
                    <div style={styles.toolCompany}>
                        <CategoryIcon category={tool.category} />
                        {tool.company} <span style={{ opacity: 0.2, margin: "0 2px" }}>·</span> {tool.category}
                    </div>
                </div>
            </div>

            <div style={styles.toolDesc}>
                <ReactMarkdown>
                    {tool.description}
                </ReactMarkdown>
            </div>

            <SocialLinks tool={tool} />

            {tool.compliance_score > 0 && (
                <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 10, fontWeight: 700, color: "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }} title="Compliance Score">
                        <Activity size={12} strokeWidth={2.5} style={{ color: "var(--accent)" }} /> SCORE: <span style={{ color: "var(--foreground)" }}>{tool.compliance_score}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }} title="Data Governance Grade">
                        <ShieldCheck size={12} strokeWidth={2.5} style={{ color: "var(--accent)" }} /> GDVR: <span style={{ color: "var(--foreground)" }}>{tool.data_governance_grade}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }} title="Transparency Index">
                        <Eye size={12} strokeWidth={2.5} style={{ color: "var(--accent)" }} /> TI: <span style={{ color: "var(--foreground)" }}>{tool.transparency_index}</span>
                    </div>
                </div>
            )}

            <div style={styles.toolTags}>
                {tool.tags && tool.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} style={styles.tag}>
                        <TrendingUp size={10} style={{ opacity: 0.5 }} />
                        {tag}
                    </span>
                ))}
            </div>


            <div style={styles.toolFooter}>
                <div style={{ marginBottom: 4 }}>
                    <StarRating rating={tool.rating} />
                    <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                        <span style={{ color: "var(--foreground)" }}>{tool.reviews?.toLocaleString() || 0}</span> ANALYSES · <span style={styles.trendBadge(tool.weekly)}>{tool.weekly || '0%'} DELTA</span>
                    </div>
                </div>
                <div style={styles.toolActions}>
                    <div style={{ alignSelf: "center", marginRight: 8 }}>
                        <div style={styles.priceTag(tool.price)}>{tool.price}</div>
                    </div>

                    <button
                        style={styles.iconBtn(!!isSaved)}
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleSave?.(tool.id);
                        }}
                        onMouseEnter={e => {
                            if (!isSaved) {
                                e.currentTarget.style.color = "var(--accent)";
                                e.currentTarget.style.borderColor = "var(--accent-glow)";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isSaved) {
                                e.currentTarget.style.color = "var(--muted)";
                                e.currentTarget.style.borderColor = "var(--border)";
                            }
                        }}
                        title="Save to Neural Vault"
                    >
                        <Heart size={18} fill={isSaved ? "var(--accent)" : "none"} strokeWidth={2.5} />
                    </button>

                    <button
                        style={styles.iconBtn(!!inCompare)}
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleCompare?.(tool);
                        }}
                        onMouseEnter={e => {
                            if (!inCompare) {
                                e.currentTarget.style.color = "var(--accent)";
                                e.currentTarget.style.borderColor = "var(--accent-glow)";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!inCompare) {
                                e.currentTarget.style.color = "var(--muted)";
                                e.currentTarget.style.borderColor = "var(--border)";
                            }
                        }}
                        title="Quantum Compare"
                    >
                        <Repeat size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}
