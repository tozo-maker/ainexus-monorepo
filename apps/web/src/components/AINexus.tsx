"use client";

import React, { useState, useEffect, Fragment } from "react";
import he from 'he';
import {
    Search,
    Globe,
    Cpu,
    Newspaper,
    Video,
    Repeat,
    Star,
    ArrowRight,
    Activity,
    User,
    LogOut,
    Zap,
    ExternalLink,
    ChevronRight,
    Play,
    Mail,
    Smartphone,
    Monitor,
    ShieldCheck,
    Diamond,
    LayoutGrid,
    TrendingUp,
    BarChart3,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';

// ============================================================
// COMPONENTS
// ============================================================
const StarRating = ({ rating }: { rating: number }) => {
    const full = Math.floor(rating);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", color: "#F59E0B" }}>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill={i < full ? "#F59E0B" : "none"}
                        strokeWidth={2}
                        opacity={i < full ? 1 : 0.2}
                    />
                ))}
            </div>
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 600 }}>{rating.toFixed(1)}</span>
        </div>
    );
};

const Badge = ({ text }: { text: string | null }) => {
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
            fontSize: "12px",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 4
        }}>
            {text.includes("🔥") && <Zap size={12} fill="var(--accent)" stroke="none" />}
            {text.replace("🔥 ", "")}
        </span>
    );
};

// ============================================================
// MAIN APP
// ============================================================
import { useRouter, useSearchParams } from "next/navigation";

// ... (existing imports)

import ChatInterface from "./ChatInterface";
import ToolCard from "./ToolCard";
import LivePulse from "./LivePulse";
import { getTools } from "@/app/actions";
import SharedNavbar from "./SharedNavbar";
// @ts-ignore
import VideoDashboard from "./layouts/VideoDashboard";
// @ts-ignore
import CodeIDE from "./layouts/CodeIDE";
// @ts-ignore
import ToolGlobe from "./spatial/ToolGlobe";

export default function AINexus({ initialTools, initialModels, news, videos, initialIntent = "GENERAL", user, initialHeroStats = { tools: 0, categories: 0, gdpr: 0, euScored: 0 } }: { initialTools: any[], initialModels: any[], news: any[], videos: any[], initialIntent?: string, user?: any, initialHeroStats?: { tools: number, categories: number, gdpr: number, euScored: number } }) {
    const router = useRouter();

    const searchParams = useSearchParams();

    // Initialize search state from URL, defaulting to empty string
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [activeCategory, setActiveCategory] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");
    const [euRisk, setEuRisk] = useState("All");
    const [gdpr, setGdpr] = useState(false);
    const [sortBy, setSortBy] = useState("rating");
    const [hoveredTool, setHoveredTool] = useState<string | null>(null);
    const [compareList, setCompareList] = useState<any[]>([]);
    const [saved, setSaved] = useState<string[]>([]);
    const [ticker, setTicker] = useState(0);
    const [spatialMode, setSpatialMode] = useState(false);

    // Dynamic Data & Pagination
    const [tools, setTools] = useState<any[]>(initialTools);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(initialTools.length);

    // Sync input with URL when URL changes (e.g. back button)
    useEffect(() => {
        const q = searchParams.get("q") || "";
        setSearchQuery(q);
        if (q) {
            setSortBy("relevance");
        } else if (sortBy === "relevance") {
            setSortBy("rating"); // Revert to rating if search cleared
        }
    }, [searchParams, sortBy]);

    // Debounced search function
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQ = searchParams.get("q") || "";
            if (searchQuery !== currentQ) {
                if (searchQuery.trim()) {
                    router.push(`/?q=${encodeURIComponent(searchQuery)}`);
                } else {
                    router.push("/");
                }
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, router, searchParams]);

    const fetchTools = async (reset = false) => {
        if (loading) return;
        setLoading(true);
        const nextPage = reset ? 1 : page + 1;

        try {
            const result = await getTools({
                searchQuery,
                category: activeCategory,
                price: priceFilter,
                euRisk,
                gdpr,
                page: nextPage,
                limit: 12
            });

            if (reset) {
                setTools(result.tools);
            } else {
                setTools(prev => [...prev, ...result.tools]);
            }

            setPage(nextPage);
            setHasMore(nextPage < result.pagination.totalPages);
            setTotalResults(result.pagination.totalCount);
        } catch (e) {
            console.error("Failed to fetch tools:", e);
        } finally {
            setLoading(false);
        }
    };

    // Use props data
    const MODELS = initialModels;
    const NEWS = news;
    const VIDEOS = videos;

    const CATEGORIES = ["All", "LLM Chat", "Image Generation", "Code Assistant", "Audio AI", "Video AI", "Writing", "Research", "Marketing", "Productivity"];

    useEffect(() => {
        if (NEWS.length > 0) {
            const interval = setInterval(() => setTicker(t => (t + 1) % NEWS.length), 4000);
            return () => clearInterval(interval);
        }
    }, [NEWS]);

    // ... (existing helper components)

    // Reset and fetch when filters or search query change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTools(true);
        }, 100); // Small buffer to ensure state is settled
        return () => clearTimeout(timer);
    }, [activeCategory, priceFilter, euRisk, gdpr, searchQuery]);

    const toggleCompare = (tool: any) => {
        if (compareList.find(t => t.id === tool.id)) {
            setCompareList(compareList.filter(t => t.id !== tool.id));
        } else if (compareList.length < 3) {
            setCompareList([...compareList, tool]);
        }
    };

    const toggleSave = (id: string) => {
        setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    };

    const styles = {
        app: { minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: "var(--font-sans), sans-serif", position: "relative" as const, overflow: "hidden" },
        grid: { position: "fixed" as const, inset: 0, backgroundImage: "linear-gradient(rgba(79,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" as const, zIndex: 0 },
        glow1: { display: "none" as const },
        glow2: { display: "none" as const },

        nav: { position: "sticky" as const, top: 0, zIndex: 100, background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", gap: 0, height: 64 },

        logo: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--foreground)", marginRight: 48, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "var(--font-display)" },
        logoAccent: { color: "var(--accent)" },
        navItem: (active: boolean) => ({
            padding: "0 16px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: active ? "var(--foreground)" : "var(--muted)",
            borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
            cursor: "pointer",
            transition: "var(--transition)",
            background: "none",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            outline: "none"
        }),
        navRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
        navBtn: { padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "var(--transition)", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", boxShadow: "var(--shadow-sm)" },
        navBtnPrimary: { padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "var(--transition)", border: "none", background: "var(--accent)", color: "#FFF", boxShadow: "0 4px 6px -1px var(--accent-glow)" },

        ticker: { display: "none" as const },

        hero: { padding: "80px 32px 60px", textAlign: "center" as const, position: "relative" as const, zIndex: 1 },
        heroLabel: { display: "none" as const },
        heroTitle: { fontSize: "clamp(42px, 5.5vw, 64px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", color: "var(--foreground)", marginBottom: 16, maxWidth: 880, margin: "0 auto 16px", fontFamily: "var(--font-display)" },
        heroSub: { fontSize: 18, color: "var(--muted)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 400, fontFamily: "var(--font-sans)" },

        searchWrap: { maxWidth: 640, margin: "0 auto", position: "relative" as const },
        searchInput: { width: "100%", padding: "16px 24px 16px 52px", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 16, color: "var(--foreground)", outline: "none", boxSizing: "border-box" as const, transition: "var(--transition)", boxShadow: "var(--shadow-lg)" },
        searchIcon: { position: "absolute" as const, left: 20, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", display: "flex", alignItems: "center" },
        searchMeta: { display: "flex", justifyContent: "center", gap: 24, marginTop: 24, color: "var(--muted)", fontSize: 13, fontWeight: 500 },
        statNum: { color: "var(--foreground)", fontWeight: 600 },

        container: { maxWidth: 1920, width: "100%", margin: "0 auto", padding: "0 32px 100px", boxSizing: "border-box" as const },

        filterBar: { display: "flex", alignItems: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" as const },
        filterChip: (active: boolean) => ({ padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "var(--transition)", border: `1px solid ${active ? "var(--border)" : "transparent"}`, background: active ? "var(--background)" : "transparent", color: active ? "var(--foreground)" : "var(--muted)", boxShadow: active ? "var(--shadow-sm)" : "none", userSelect: "none" as const }),
        filterLabel: { color: "var(--foreground)", fontSize: 13, fontWeight: 600, marginRight: 8 },
        select: { background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", outline: "none", transition: "var(--transition)", boxShadow: "var(--shadow-sm)" },

        grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 },

        toolCard: (hovered: boolean, inCompare: boolean) => ({}),
        toolHeader: {},
        toolLogo: {},
        toolName: {},
        toolCompany: {},
        toolDesc: {},
        toolTags: {},
        tag: {},
        toolFooter: {},
        priceTag: (price: string) => ({}),
        toolActions: {},
        iconBtn: (active: boolean) => ({}),
        trendBadge: (weekly: string) => ({}),

        sectionTitle: { fontSize: 28, fontWeight: 800, color: "var(--foreground)", marginBottom: 8, letterSpacing: "-1px", fontFamily: "var(--font-display)" },
        sectionSub: { fontSize: 16, color: "var(--muted)", marginBottom: 32, lineHeight: 1.5, fontWeight: 400 },

        twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 48 },

        newsCard: (i: number) => ({ padding: "16px", background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "var(--transition)", marginBottom: 12, boxShadow: "var(--shadow-sm)" }),
        newsEmoji: { width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary)", borderRadius: 8, color: "var(--accent)" },
        newsTitle: { fontSize: 15, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.4, marginBottom: 4 },
        newsMeta: { fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, alignItems: "center" },
        catPill: (cat: string) => {
            return { background: "var(--primary)", color: "var(--muted)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500 };
        },

        videoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 },
        videoCard: { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "var(--transition)", position: "relative" as const, boxShadow: "var(--shadow-sm)" },
        videoThumb: { height: 180, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" as const, overflow: "hidden" },
        videoPlay: { position: "absolute" as const, inset: 0, background: "rgba(15,23,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "var(--transition)", color: "#FFFFFF" },
        videoInfo: { padding: 16 },
        videoTitle: { fontSize: 15, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.5, marginBottom: 8 },
        videoMeta: { fontSize: 13, color: "var(--muted)", display: "flex", gap: 8, fontWeight: 500 },

        modelTable: { width: "100%", borderCollapse: "separate" as const, borderSpacing: "0 4px", fontSize: 14 },
        th: { padding: "12px 16px", color: "var(--muted)", fontWeight: 600, textAlign: "left" as const, fontSize: 12, borderBottom: "1px solid var(--border)" },
        td: { padding: "16px", background: "var(--background)", color: "var(--foreground)", verticalAlign: "middle" as const, borderTop: "1px solid transparent", borderBottom: "1px solid var(--border)" },

        compareBar: { position: "fixed" as const, bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", borderRadius: 100, padding: "8px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--shadow-lg)" },
        compareBtn: { padding: "8px 20px", background: "var(--foreground)", color: "#FFF", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "var(--transition)" },

        statCard: { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column" as const, gap: 8, transition: "var(--transition)", boxShadow: "var(--shadow-sm)" },
        statVal: { fontSize: 32, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-1px", fontFamily: "var(--font-display)" },
        statLabel: { fontSize: 13, color: "var(--muted)", fontWeight: 500 },

        divider: { height: 1, background: "var(--border)", margin: "48px 0" },

        scoreBar: (val: number, max: number, color: string) => ({
            height: 4, borderRadius: 2, width: `${(val / max) * 100}%`, background: "var(--accent)", transition: "width 1s var(--ease-spring)"
        }),
        scoreTrack: { height: 4, borderRadius: 2, background: "var(--primary)", flex: 1 },
    };

    const navItems = [
        { id: "discover", label: "Discover", icon: <Globe size={14} /> },
        { id: "models", label: "Intelligence", icon: <Cpu size={14} /> },
        { id: "news", label: "Newsroom", icon: <Newspaper size={14} /> },
        { id: "videos", label: "Studio", icon: <Video size={14} /> },
        { id: "compare", label: "Compare", icon: <Repeat size={14} /> },
    ];

    if (!NEWS || NEWS.length === 0) return <div>Loading...</div>;

    // Phase 13: Spatial Web
    if (spatialMode) {
        return (
            <div style={{ width: "100vw", height: "100vh", background: "black", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 20, left: 20, zIndex: 100 }}>
                    <button onClick={() => setSpatialMode(false)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer", backdropFilter: "blur(4px)" }}>
                        ← Exit 3D View
                    </button>
                </div>
                <ToolGlobe tools={tools} />
            </div>
        );
    }

    // Phase 11: Generative UI - Video Dashboard
    if (initialIntent === "VIDEO") {
        return (
            <div style={styles.app}>
                <nav style={styles.nav}>
                    <div style={styles.logo} onClick={() => window.location.href = "/"}>
                        <span style={{ fontSize: 22 }}>◈</span>
                        <span>AI<span style={styles.logoAccent}>Nexus</span></span>
                        <span style={{ marginLeft: 12, fontSize: 11, background: "#EF4444", color: "white", padding: "2px 8px", borderRadius: 100 }}>VIDEO STUDIO</span>
                    </div>
                    <div style={styles.navRight}>
                        <button onClick={() => window.location.href = "/"} style={{ ...styles.navBtn, background: "transparent", border: "1px solid rgba(96,165,250,0.2)", color: "#94A3B8" }}>Exit Studio</button>
                    </div>
                </nav>
                <VideoDashboard tools={tools} />
            </div>
        );
    }

    // Phase 11: Generative UI - Code IDE
    if (initialIntent === "CODE") {
        // CodeIDE handles its own full layout
        return <CodeIDE tools={tools} onExit={() => window.location.href = "/"} />;
    }

    return (
        <div style={styles.app}>
            <div style={styles.grid} />
            <div style={styles.glow1} />
            <div style={styles.glow2} />

            {/* NEWS TICKER */}
            <div style={styles.ticker}>
                {NEWS.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, animation: "fadeIn 0.5s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 900, background: "rgba(202,138,4,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(202,138,4,0.2)" }}>
                            <Activity size={10} strokeWidth={3} />
                            <span>LIVE</span>
                        </div>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <span style={{ fontWeight: 600 }}>{he.decode(NEWS[ticker].title)}</span>
                    </div>
                )}
                <span style={{ marginLeft: "auto", flexShrink: 0, color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>{NEWS[ticker]?.source} · {NEWS[ticker]?.time}</span>
            </div>

            <SharedNavbar
                user={user}
                compareListCount={compareList.length}
            />

            {/* HERO */}
            <div style={styles.hero}>
                <div style={styles.heroLabel}>
                    <Zap size={10} fill="var(--accent)" stroke="none" />
                    <span>The Ultimate AI Intelligence Hub</span>
                </div>
                <h1 style={styles.heroTitle}>Track The Entire<br />AI Ecosystem.</h1>
                <p style={styles.heroSub}>The world's most comprehensive catalog of AI tools, models, and real-time intelligence — updated every hour.</p>
                <div style={styles.searchWrap}>
                    <span style={styles.searchIcon}>
                        <Search size={20} />
                    </span>
                    <input
                        style={styles.searchInput}
                        placeholder={`Search ${initialHeroStats.tools.toLocaleString()}+ tools, verified models, and compliance reports...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={styles.searchMeta}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <LayoutGrid size={14} style={{ color: "var(--accent)" }} />
                        <span><span style={styles.statNum}>{initialHeroStats.tools.toLocaleString()}</span> Tools</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Cpu size={14} style={{ color: "var(--accent)" }} />
                        <span><span style={styles.statNum}>80+</span> Models</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ShieldCheck size={14} style={{ color: "var(--accent)" }} />
                        <span><span style={styles.statNum}>{initialHeroStats.gdpr.toLocaleString()}</span> GDPR Graded</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Video size={14} style={{ color: "var(--accent)" }} />
                        <span><span style={styles.statNum}>500+</span> Guides</span>
                    </div>
                </div>
            </div>

            {/* ==================== DISCOVER ==================== */}
            <div style={styles.container}>
                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 48 }}>
                    {[
                        { val: initialHeroStats.tools.toLocaleString(), label: "Tools Catalogued", sub: "Enterprise & startup catalog", icon: <LayoutGrid size={24} /> },
                        { val: initialHeroStats.categories.toLocaleString(), label: "Categories Covered", sub: "Organized intents", icon: <Cpu size={24} /> },
                        { val: initialHeroStats.gdpr.toLocaleString(), label: "GDPR Graded", sub: "Compliance transparency", icon: <ShieldCheck size={24} /> },
                        { val: initialHeroStats.euScored.toLocaleString(), label: "EU AI Act Scored", sub: "Calculated risk scoring", icon: <Globe size={24} /> },
                    ].map((s, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <div style={styles.statVal}>{s.val}</div>
                                <div style={{ color: "var(--accent)", opacity: 0.6 }}>{s.icon}</div>
                            </div>
                            <div>
                                <div style={styles.statLabel}>{s.label}</div>
                                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div style={styles.filterBar}>
                    <span style={styles.filterLabel}>Category</span>
                    {CATEGORIES.map((cat: string) => (
                        <div key={cat} style={styles.filterChip(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>{cat}</div>
                    ))}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--foreground)" }}>
                            <input type="checkbox" checked={gdpr} onChange={e => setGdpr(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                            GDPR ✓
                        </label>

                        <span style={{ width: 1, height: 16, background: "var(--border)", margin: "0 4px" }} />

                        <span style={styles.filterLabel}>EU Risk</span>
                        <select style={styles.select} value={euRisk} onChange={e => setEuRisk(e.target.value)}>
                            {["All", "Minimal", "Limited", "High", "Unacceptable", "Unclassified"].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>

                        <span style={styles.filterLabel}>Price</span>
                        <select style={styles.select} value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                            {["All", "Free", "Freemium", "Paid"].map(p => <option key={p}>{p}</option>)}
                        </select>
                        <span style={styles.filterLabel}>Sort</span>
                        <select style={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="relevance" disabled={!searchQuery}>Relevance</option>
                            <option value="rating">Top Rated</option>
                            <option value="reviews">Most Reviews</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div style={{ marginBottom: 16, color: "#475569", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        Showing <span style={{ color: "#60A5FA", fontWeight: 600 }}>{tools.length}</span> of <span style={{ color: "#94A3B8" }}>{totalResults}</span> tools
                        {compareList.length > 0 && <span style={{ marginLeft: 16, color: "#F59E0B" }}>· {compareList.length} selected for comparison</span>}
                    </div>
                    {loading && <div style={{ fontSize: 11, color: "#60A5FA", fontWeight: 600 }}>Loading tools...</div>}
                </div>

                {/* Tool Grid */}
                <div style={styles.grid2}>
                    {tools.map((tool: any, idx: number) => (
                        <div
                            key={tool.id}
                            className="stagger-item"
                            style={{ "--index": idx } as React.CSSProperties}
                        >
                            <ToolCard
                                tool={tool}
                                inCompare={!!compareList.find(t => t.id === tool.id)}
                                isSaved={saved.includes(tool.id)}
                                onToggleSave={toggleSave}
                                onToggleCompare={toggleCompare}
                            />
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div style={{ marginTop: 40, textAlign: "center" }}>
                        <button
                            onClick={() => fetchTools(false)}
                            disabled={loading}
                            style={{
                                ...styles.navBtn,
                                background: "rgba(59,130,246,0.1)",
                                border: "1px solid rgba(59,130,246,0.2)",
                                color: "#60A5FA",
                                padding: "12px 40px",
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            {loading ? "Loading..." : "Load More Tools"}
                        </button>
                    </div>
                )}
            </div>

            {/* COMPARE BAR */}
            {compareList.length > 0 && (
                <div style={styles.compareBar}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ background: "rgba(202,138,4,0.1)", padding: 8, borderRadius: 10, color: "var(--accent)" }}>
                                <Repeat size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 900, color: "#FFF", fontSize: 14, letterSpacing: "-0.2px" }}>Matrix Comparison</div>
                                <div style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>{compareList.length} units queued for analysis</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {compareList.map(tool => (
                                <div key={tool.id} style={{ padding: "4px 12px", background: "rgba(28,25,23,0.6)", border: "1px solid var(--border)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700 }}>
                                    <span>{tool.name}</span>
                                    <button onClick={() => toggleCompare(tool)} style={{ color: "var(--muted)", background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
                                        <XCircle size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button style={styles.compareBtn} onClick={() => router.push("/compare")}>
                        <span>Launch Analysis</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
            {/* Global Footer */}
            <div style={{ padding: "40px 32px", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--muted)", fontSize: 13, display: "flex", flexDirection: "column", gap: 12, alignItems: "center", background: "rgba(12,10,9,0.5)", marginTop: "auto" }}>
                <div>© 2026 AI Nexus. Independent Intelligence Directory.</div>
                <div style={{ display: "flex", gap: 24, fontWeight: 600 }}>
                    <a href="/methodology" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}>Methodology</a>
                    <a href="mailto:hello@ainexus.io" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}>Contact</a>
                </div>
            </div>

            <ChatInterface />
        </div>
    );
}
