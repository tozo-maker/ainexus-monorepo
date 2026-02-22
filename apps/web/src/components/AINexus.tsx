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

export default function AINexus({ initialTools, initialModels, news, videos, initialIntent = "GENERAL", user }: { initialTools: any[], initialModels: any[], news: any[], videos: any[], initialIntent?: string, user?: any }) {
    const router = useRouter();

    const searchParams = useSearchParams();

    // Initialize search state from URL, defaulting to empty string
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [activeNav, setActiveNav] = useState("discover");
    const [activeCategory, setActiveCategory] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");
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
    }, [activeCategory, priceFilter, searchQuery]);

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
    if (initialIntent === "VIDEO" && activeNav === "discover") {
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
    if (initialIntent === "CODE" && activeNav === "discover") {
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
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                user={user}
                compareListCount={compareList.length}
            />

            {/* HERO */}
            {activeNav === "discover" && (
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
                            placeholder="Search 4,200+ tools, 80+ models, and 500+ video guides..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={styles.searchMeta}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <LayoutGrid size={14} style={{ color: "var(--accent)" }} />
                            <span><span style={styles.statNum}>4,200+</span> Tools</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Cpu size={14} style={{ color: "var(--accent)" }} />
                            <span><span style={styles.statNum}>80+</span> Models</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Newspaper size={14} style={{ color: "var(--accent)" }} />
                            <span><span style={styles.statNum}>Daily</span> News</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Video size={14} style={{ color: "var(--accent)" }} />
                            <span><span style={styles.statNum}>500+</span> Guides</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== DISCOVER ==================== */}
            {activeNav === "discover" && (
                <div style={styles.container}>
                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 48 }}>
                        {[
                            { val: "4,287", label: "Tools Catalogued", sub: "+23 this week", icon: <LayoutGrid size={24} /> },
                            { val: "82", label: "Intelligence Units", sub: "Tracked & benchmarked", icon: <Cpu size={24} /> },
                            { val: "1.2M", label: "Monthly Intelligence", sub: "Growing community", icon: <Globe size={24} /> },
                            { val: "99%", label: "System Uptime", sub: "Real-time data sync", icon: <ShieldCheck size={24} /> },
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
            )}

            {/* ==================== MODELS ==================== */}
            {activeNav === "models" && (
                <div style={styles.container}>
                    {/* Live Pulse Ticker */}
                    <div style={{ marginBottom: 32 }}>
                        <LivePulse />
                    </div>

                    <div style={{ paddingTop: 40, marginBottom: 40 }}>
                        <div style={styles.sectionTitle}>Foundation Intelligence</div>
                        <div style={styles.sectionSub}>Comprehensive tracking of major LLMs with benchmarks, capabilities, and real-time pricing.</div>
                    </div>

                    <div style={{ background: "rgba(28,25,23,0.3)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
                        <table style={styles.modelTable}>
                            <thead>
                                <tr>
                                    {["Model", "Company", "Context", "MMLU / Arena", "Pricing (1M)", "Capabilities"].map(h => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MODELS.map((m: any, i: number) => (
                                    <tr key={m.id}>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: 800, color: "#FFF", marginBottom: 4 }}>{m.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                                <Clock size={10} /> {m.release}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{ color: "var(--muted)", fontWeight: 600 }}>{m.company}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{ color: "var(--accent)", fontWeight: 800, fontFamily: "monospace", fontSize: 13 }}>{m.context}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <span style={{ fontWeight: 800, color: m.mmlu > 88 ? "#34D399" : "#FFF", fontSize: 12, width: 30 }}>{m.mmlu}</span>
                                                    <div style={styles.scoreTrack}><div style={styles.scoreBar(m.mmlu, 100, m.mmlu > 88 ? "#34D399" : "var(--accent)")} /></div>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <span style={{ fontWeight: 800, color: "#F59E0B", fontSize: 12, width: 30 }}>{m.arena}</span>
                                                    <div style={styles.scoreTrack}><div style={styles.scoreBar(m.arena, 1350, "#F59E0B")} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            {m.opensource ? (
                                                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34D399", fontWeight: 800, fontSize: 12 }}>
                                                    <Globe size={12} /> OPEN SOURCE
                                                </div>
                                            ) : (
                                                <div style={{ fontFamily: "monospace", fontSize: 13, color: "var(--muted)" }}>
                                                    <span style={{ color: "var(--accent)" }}>${m.price_in.toFixed(2)}</span> / <span style={{ color: "#FFF" }}>${m.price_out.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                {m.multimodal && <span style={{ ...styles.tag, color: "#A78BFA", background: "rgba(167,139,250,0.1)", borderColor: "rgba(167,139,250,0.2)" }}>MULTIMODAL</span>}
                                                {m.opensource && <span style={{ ...styles.tag, color: "#34D399", background: "rgba(52,211,153,0.1)", borderColor: "rgba(52,211,153,0.2)" }}>OPEN</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ==================== NEWS ==================== */}
            {activeNav === "news" && (
                <div style={styles.container}>
                    <div style={{ paddingTop: 40, marginBottom: 40 }}>
                        <div style={styles.sectionTitle}>Intelligence Feed</div>
                        <div style={styles.sectionSub}>Curated industry intelligence from 200+ global sources — updated every 15 minutes.</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                        <div>
                            <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 20 }}>LATEST DISPATCHES</div>
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                                {NEWS.map((item: any, i: number) => (
                                    <button key={item.id} style={{ ...styles.newsCard(i), border: item.hot ? "1px solid rgba(202,138,4,0.3)" : "1px solid var(--border)", background: item.hot ? "rgba(202,138,4,0.05)" : "rgba(28,25,23,0.3)", width: "100%", textAlign: "left" }}>
                                        <div style={styles.newsEmoji}>
                                            {item.category === "Model Release" ? <Zap size={20} /> :
                                                item.category === "Funding" ? <Activity size={20} /> :
                                                    item.category === "Research" ? <Cpu size={20} /> : <Newspaper size={20} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={styles.newsTitle}>
                                                {item.hot && <span style={{ color: "var(--accent)", marginRight: 8, fontSize: 12 }}>🔥</span>}
                                                {he.decode(item.title)}
                                            </div>
                                            <div style={styles.newsMeta}>
                                                <span style={styles.catPill(item.category)}>{item.category}</span>
                                                <span>{item.source}</span>
                                                <span style={{ opacity: 0.3 }}>·</span>
                                                <span>{item.time}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} style={{ color: "var(--muted)" }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
                            <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 20 }}>TOPICS</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {["Model Release", "Funding", "Research", "Open Source", "Regulation", "Milestone"].map(cat => {
                                    const colors: Record<string, string> = { "Model Release": "#3B82F6", "Funding": "#CA8A04", "Research": "#8B5CF6", "Open Source": "#10B981", "Regulation": "#EF4444", "Milestone": "#06B6D4" };
                                    return (
                                        <button key={cat} style={{ padding: "16px", background: "rgba(28,25,23,0.4)", border: "1px solid var(--border)", borderRadius: 12, textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                                            <div style={{ color: colors[cat] || "var(--muted)", fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{cat}</div>
                                            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Active Today</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: 32, padding: 32, background: "rgba(202,138,4,0.05)", border: "1px solid rgba(202,138,4,0.15)", borderRadius: 16, textAlign: "center" }}>
                                <div style={{ background: "rgba(202,138,4,0.1)", width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--accent)" }}>
                                    <Mail size={24} />
                                </div>
                                <div style={{ fontWeight: 900, color: "#FFF", marginBottom: 8, fontSize: 18, letterSpacing: "-0.5px" }}>Elite AI Digest</div>
                                <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Join 50,000+ AI professionals receiving the latest intelligence every morning.</div>
                                <div style={{ position: "relative" }}>
                                    <input placeholder="professional@email.com" style={{ ...styles.searchInput, padding: "12px 16px", fontSize: 14, marginBottom: 12, background: "rgba(12,10,9,0.4)" }} />
                                    <button style={styles.compareBtn}>Subscribe Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== VIDEOS ==================== */}
            {activeNav === "videos" && (
                <div style={styles.container}>
                    <div style={{ paddingTop: 40, marginBottom: 40 }}>
                        <div style={styles.sectionTitle}>Studio Intelligence</div>
                        <div style={styles.sectionSub}>Expert breakdowns, tutorials, and deep-dives from the global AI community.</div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                        {["All Resources", "Tutorials", "Benchmarking", "Code Reviews", "Generative Art", "System Design"].map(cat => (
                            <button key={cat} style={styles.filterChip(cat === "All Resources")}>{cat}</button>
                        ))}
                    </div>

                    <div style={styles.videoGrid}>
                        {VIDEOS.map((v: any) => (
                            <button key={v.id} style={{ ...styles.videoCard, textAlign: "left", width: "100%", border: "none" }}
                                onMouseEnter={e => {
                                    const overlay = e.currentTarget.querySelector('.play-overlay') as HTMLElement;
                                    if (overlay) overlay.style.opacity = '1';
                                }}
                                onMouseLeave={e => {
                                    const overlay = e.currentTarget.querySelector('.play-overlay') as HTMLElement;
                                    if (overlay) overlay.style.opacity = '0';
                                }}
                            >
                                <div style={styles.videoThumb}>
                                    <img src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <div className="play-overlay" style={styles.videoPlay}>
                                        <Play size={24} fill="var(--accent)" stroke="none" />
                                    </div>
                                    <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.8)", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                                        {v.duration}
                                    </div>
                                </div>
                                <div style={styles.videoInfo}>
                                    <div style={{ ...styles.videoTitle, height: "3em", overflow: "hidden" }}>{v.title}</div>
                                    <div style={styles.videoMeta}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", fontWeight: 700 }}>
                                            <Video size={12} /> {v.channel}
                                        </div>
                                        <span style={{ opacity: 0.3 }}>·</span>
                                        <span>{v.views} views</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================== COMPARE ==================== */}
            {activeNav === "compare" && (
                <div style={styles.container}>
                    <div style={{ paddingTop: 40, marginBottom: 40 }}>
                        <div style={styles.sectionTitle}>Intelligence Matrix</div>
                        <div style={styles.sectionSub}>Architectural breakdown and side-by-side performance benchmarks.</div>
                    </div>

                    {compareList.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "120px 20px", background: "rgba(28,25,23,0.3)", borderRadius: 24, border: "1px dotted var(--border)" }}>
                            <div style={{ background: "rgba(202,138,4,0.1)", width: 64, height: 64, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--accent)" }}>
                                <Repeat size={32} />
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: "#FFF", marginBottom: 8, letterSpacing: "-0.5px" }}>Matrix is Empty</div>
                            <div style={{ fontSize: 14, color: "var(--muted)", maxWidth: 300, margin: "0 auto 32px", lineHeight: 1.5 }}>Select up to 3 models or tools from the intelligence catalog to begin architectural comparison.</div>
                            <button style={styles.compareBtn} onClick={() => setActiveNav("discover")}>Initialize Catalog</button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: "grid", gridTemplateColumns: `240px ${compareList.map(() => "1fr").join(" ")}`, gap: 0, background: "rgba(28,25,23,0.4)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", backdropFilter: "blur(10px)" }}>
                                {/* Header */}
                                <div style={{ padding: 24, borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)", background: "rgba(12,10,9,0.2)" }}>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", letterSpacing: "1px" }}>SPECIFICATIONS</div>
                                </div>
                                {compareList.map(tool => (
                                    <div key={tool.id} style={{ padding: 24, borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)", textAlign: "center" }}>
                                        <div style={{ fontSize: 32, marginBottom: 12 }}>{tool.logo}</div>
                                        <div style={{ fontWeight: 900, color: "#FFF", fontSize: 18, marginBottom: 4, letterSpacing: "-0.5px" }}>{tool.name}</div>
                                        <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{tool.company}</div>
                                        <Badge text={tool.badge} />
                                    </div>
                                ))}

                                {/* Rows */}
                                {[
                                    { label: "Intelligence Rating", key: "rating", icon: <Star size={14} />, format: (r: any) => <StarRating rating={r} /> },
                                    { label: "Community Signal", key: "reviews", icon: <Globe size={14} />, format: (r: any) => <span style={{ color: "var(--accent)", fontWeight: 800 }}>{r.toLocaleString()}</span> },
                                    { label: "Pricing Model", key: "price", icon: <TrendingUp size={14} />, format: (p: any) => <span style={{ ...styles.priceTag(p), fontSize: 11, padding: "2px 8px" }}>{p}</span> },
                                    { label: "Primary Category", key: "category", icon: <LayoutGrid size={14} />, format: (c: any) => <span style={{ fontWeight: 600 }}>{c}</span> },
                                    { label: "Core Architecture", key: "model", icon: <Cpu size={14} />, format: (m: any) => <span style={{ fontFamily: "monospace", fontSize: 12, color: "#A78BFA", background: "rgba(167,139,250,0.1)", padding: "2px 6px", borderRadius: 4 }}>{m}</span> },
                                    { label: "API Availability", key: "api", icon: <Monitor size={14} />, format: (v: any) => v ? <div style={{ color: "#34D399", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontWeight: 700 }}><CheckCircle2 size={14} /> ENABLED</div> : <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontWeight: 700 }}><XCircle size={14} /> NONE</div> },
                                    { label: "Open Intelligence", key: "opensource", icon: <ShieldCheck size={14} />, format: (v: any) => v ? <div style={{ color: "#34D399", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontWeight: 700 }}><CheckCircle2 size={14} /> YES</div> : <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontWeight: 700 }}><XCircle size={14} /> NO</div> },
                                ].map(row => (
                                    <Fragment key={row.label}>
                                        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)", color: "var(--muted)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 10, background: "rgba(12,10,9,0.1)" }}>
                                            <span style={{ color: "var(--accent)", opacity: 0.8 }}>{row.icon}</span>
                                            {row.label}
                                        </div>
                                        {compareList.map(tool => (
                                            <div key={tool.id} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)", textAlign: "center", fontSize: 13, color: "var(--foreground)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {row.format(tool[row.key])}
                                            </div>
                                        ))}
                                    </Fragment>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                                <button style={{ ...styles.compareBtn, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--muted)" }} onClick={() => setCompareList([])}>Clear Matrix</button>
                                <button style={styles.compareBtn} onClick={() => setActiveNav("discover")}>Add More Units</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* COMPARE BAR */}
            {compareList.length > 0 && activeNav !== "compare" && (
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
                    <button style={styles.compareBtn} onClick={() => setActiveNav("compare")}>
                        <span>Launch Analysis</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}

            <ChatInterface />
        </div>
    );
}
