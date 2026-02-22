import { useState, useEffect, useRef } from "react";

// ============================================================
// DATA
// ============================================================
const TOOLS = [
  { id: 1, name: "ChatGPT", category: "LLM Chat", tags: ["chat", "writing", "code"], price: "Freemium", rating: 4.8, reviews: 6173, model: "GPT-4o", company: "OpenAI", badge: "Most Popular", description: "The industry-leading conversational AI for research, writing, coding, and automation.", weekly: "+12%", featured: true, logo: "🤖", api: true, opensource: false },
  { id: 2, name: "Claude", category: "LLM Chat", tags: ["chat", "analysis", "code"], price: "Freemium", rating: 4.9, reviews: 4820, model: "Claude 3.5", company: "Anthropic", badge: "Editor's Pick", description: "Exceptional reasoning, analysis, and long-context understanding with a strong safety focus.", weekly: "+8%", featured: true, logo: "✦", api: true, opensource: false },
  { id: 3, name: "Midjourney", category: "Image Generation", tags: ["image", "art", "design"], price: "Paid", rating: 4.7, reviews: 3811, model: "MJ v6", company: "Midjourney", badge: "Top Rated", description: "The gold standard for AI art generation. Stunning aesthetics and photorealism.", weekly: "+5%", featured: true, logo: "🎨", api: false, opensource: false },
  { id: 4, name: "Cursor", category: "Code Assistant", tags: ["code", "IDE", "productivity"], price: "Freemium", rating: 4.9, reviews: 2940, model: "GPT-4 / Claude", company: "Anysphere", badge: "🔥 Trending", description: "AI-first code editor that understands your entire codebase and writes code with you.", weekly: "+34%", featured: true, logo: "⚡", api: false, opensource: false },
  { id: 5, name: "Perplexity", category: "AI Search", tags: ["search", "research", "chat"], price: "Freemium", rating: 4.6, reviews: 1247, model: "Multiple", company: "Perplexity AI", badge: null, description: "Real-time AI search engine that cites its sources and answers complex questions.", weekly: "+18%", featured: false, logo: "🔍", api: true, opensource: false },
  { id: 6, name: "ElevenLabs", category: "Audio AI", tags: ["voice", "audio", "TTS"], price: "Freemium", rating: 4.8, reviews: 980, model: "EL v2", company: "ElevenLabs", badge: "🔥 Trending", description: "Most realistic AI voice synthesis. Clone voices, generate speech in 30 languages.", weekly: "+22%", featured: false, logo: "🎙️", api: true, opensource: false },
  { id: 7, name: "Runway", category: "Video Generation", tags: ["video", "creative", "generation"], price: "Freemium", rating: 4.5, reviews: 876, model: "Gen-3", company: "Runway", badge: null, description: "Professional-grade AI video generation and editing for filmmakers and creators.", weekly: "+15%", featured: false, logo: "🎬", api: true, opensource: false },
  { id: 8, name: "Ollama", category: "Local AI", tags: ["local", "open-source", "LLM"], price: "Free", rating: 4.7, reviews: 2100, model: "Various", company: "Ollama", badge: "Open Source", description: "Run powerful LLMs locally on your machine. Full privacy, no internet required.", weekly: "+41%", featured: false, logo: "🦙", api: true, opensource: true },
  { id: 9, name: "Suno", category: "Audio AI", tags: ["music", "audio", "generation"], price: "Freemium", rating: 4.6, reviews: 1560, model: "v4", company: "Suno", badge: "🔥 Trending", description: "Create full songs from text prompts. Lyrics, vocals, and instrumentation in seconds.", weekly: "+29%", featured: false, logo: "🎵", api: false, opensource: false },
  { id: 10, name: "Replit", category: "Code Assistant", tags: ["code", "cloud", "deployment"], price: "Freemium", rating: 4.4, reviews: 1890, model: "GPT-4", company: "Replit", badge: null, description: "AI-powered collaborative coding environment with instant deployment.", weekly: "+7%", featured: false, logo: "🔁", api: true, opensource: false },
  { id: 11, name: "Stable Diffusion", category: "Image Generation", tags: ["image", "open-source", "local"], price: "Free", rating: 4.5, reviews: 4200, model: "SDXL / SD3", company: "Stability AI", badge: "Open Source", description: "The most powerful open-source image generation model. Fully customizable.", weekly: "+3%", featured: false, logo: "🌀", api: true, opensource: true },
  { id: 12, name: "Kling AI", category: "Video Generation", tags: ["video", "generation", "realistic"], price: "Freemium", rating: 4.7, reviews: 620, model: "Kling 1.5", company: "Kuaishou", badge: "New", description: "Hyper-realistic video generation with excellent motion coherence and physics.", weekly: "+67%", featured: false, logo: "🎥", api: false, opensource: false },
];

const MODELS = [
  { id: 1, name: "GPT-4o", company: "OpenAI", context: "128K", mmlu: 88.7, humaneval: 90.2, arena: 1310, price_in: 2.50, price_out: 10.00, opensource: false, multimodal: true, release: "May 2024" },
  { id: 2, name: "Claude 3.5 Sonnet", company: "Anthropic", context: "200K", mmlu: 88.3, humaneval: 92.0, arena: 1268, price_in: 3.00, price_out: 15.00, opensource: false, multimodal: true, release: "Oct 2024" },
  { id: 3, name: "Gemini 1.5 Pro", company: "Google", context: "1M", mmlu: 85.9, humaneval: 84.1, arena: 1220, price_in: 3.50, price_out: 10.50, opensource: false, multimodal: true, release: "Apr 2024" },
  { id: 4, name: "Llama 3.1 405B", company: "Meta", context: "128K", mmlu: 88.6, humaneval: 89.0, arena: 1170, price_in: 0.00, price_out: 0.00, opensource: true, multimodal: false, release: "Jul 2024" },
  { id: 5, name: "Grok 2", company: "xAI", context: "128K", mmlu: 87.5, humaneval: 88.4, arena: 1240, price_in: 2.00, price_out: 10.00, opensource: false, multimodal: true, release: "Aug 2024" },
  { id: 6, name: "Mistral Large 2", company: "Mistral", context: "128K", mmlu: 84.0, humaneval: 92.1, arena: 1095, price_in: 2.00, price_out: 6.00, opensource: false, multimodal: false, release: "Jul 2024" },
];

const NEWS = [
  { id: 1, title: "OpenAI Releases GPT-4.5 Turbo with 2x Speed Improvement", source: "TechCrunch", time: "2h ago", category: "Model Release", hot: true, img: "🤖" },
  { id: 2, title: "Anthropic Raises $4B Series D at $60B Valuation", source: "Bloomberg", time: "5h ago", category: "Funding", hot: true, img: "💰" },
  { id: 3, title: "Google DeepMind Publishes Gemini Ultra 2 Benchmark Results", source: "DeepMind Blog", time: "8h ago", category: "Research", hot: false, img: "📊" },
  { id: 4, title: "Cursor Hits 1M Daily Active Developers", source: "VentureBeat", time: "12h ago", category: "Milestone", hot: false, img: "⚡" },
  { id: 5, title: "Meta Open-Sources Llama 3.2 with Vision Capabilities", source: "The Verge", time: "1d ago", category: "Open Source", hot: true, img: "🦙" },
  { id: 6, title: "EU AI Act Compliance Deadline Approaching: What Tools Are Affected?", source: "Wired", time: "1d ago", category: "Regulation", hot: false, img: "⚖️" },
];

const VIDEOS = [
  { id: 1, title: "I Tested Every AI Coding Tool — Here's the Winner", channel: "Fireship", views: "2.4M", time: "3d ago", category: "Code", thumb: "⚡" },
  { id: 2, title: "GPT-4o vs Claude 3.5 vs Gemini: The ULTIMATE Comparison", channel: "AI Explained", views: "1.8M", time: "1w ago", category: "Comparison", thumb: "🔬" },
  { id: 3, title: "Building an AI Agent in 15 Minutes with LangChain", channel: "Matt Wolfe", views: "890K", time: "5d ago", category: "Tutorial", thumb: "🤖" },
  { id: 4, title: "Midjourney v7 First Look: Insane Quality Upgrade", channel: "Two Minute Papers", views: "1.2M", time: "2d ago", category: "Image AI", thumb: "🎨" },
  { id: 5, title: "The Real Cost of AI APIs in 2025 — Full Breakdown", channel: "AI Jason", views: "445K", time: "1w ago", category: "Pricing", thumb: "💸" },
  { id: 6, title: "Local LLMs Are Now BETTER Than GPT-4 (Here's How)", channel: "Theo", views: "1.1M", time: "4d ago", category: "Local AI", thumb: "🦙" },
];

const CATEGORIES = ["All", "LLM Chat", "Image Generation", "Code Assistant", "Video Generation", "Audio AI", "AI Search", "Local AI"];

// ============================================================
// COMPONENTS
// ============================================================
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const dec = rating - full;
  return (
    <span style={{ color: "#F59E0B", fontSize: "12px", letterSpacing: "1px" }}>
      {"★".repeat(full)}{dec >= 0.5 ? "½" : ""}{"☆".repeat(5 - full - (dec >= 0.5 ? 1 : 0))}
      <span style={{ color: "#94A3B8", marginLeft: 4, fontSize: "11px" }}>{rating}</span>
    </span>
  );
};

const Badge = ({ text }) => {
  if (!text) return null;
  const colors = {
    "Most Popular": { bg: "#1E3A5F", color: "#60A5FA", border: "#3B82F6" },
    "Editor's Pick": { bg: "#1A3A2A", color: "#34D399", border: "#10B981" },
    "Top Rated": { bg: "#3A1A3A", color: "#C084FC", border: "#A855F7" },
    "🔥 Trending": { bg: "#3A1F0A", color: "#FB923C", border: "#F97316" },
    "Open Source": { bg: "#1A2A1A", color: "#86EFAC", border: "#22C55E" },
    "New": { bg: "#1E1A3A", color: "#A78BFA", border: "#7C3AED" },
  };
  const c = colors[text] || { bg: "#1E293B", color: "#94A3B8", border: "#334155" };
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 4, padding: "2px 8px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>{text}</span>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function AINeXus() {
  const [activeNav, setActiveNav] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [hoveredTool, setHoveredTool] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [saved, setSaved] = useState([1, 3]);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker(t => (t + 1) % NEWS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredTools = TOOLS.filter(t => {
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some(tag => tag.includes(searchQuery.toLowerCase())) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchPrice = priceFilter === "All" || t.price === priceFilter;
    return matchSearch && matchCat && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    if (sortBy === "trending") return parseInt(b.weekly) - parseInt(a.weekly);
    return 0;
  });

  const toggleCompare = (tool) => {
    if (compareList.find(t => t.id === tool.id)) {
      setCompareList(compareList.filter(t => t.id !== tool.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, tool]);
    }
  };

  const toggleSave = (id) => {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const styles = {
    app: { minHeight: "100vh", background: "#050A14", color: "#E2E8F0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden" },
    grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(96,165,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 },
    glow1: { position: "fixed", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
    glow2: { position: "fixed", bottom: -300, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
    
    nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(5,10,20,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(96,165,250,0.12)", padding: "0 32px", display: "flex", alignItems: "center", gap: 0, height: 60 },
    logo: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#F1F5F9", marginRight: 40, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
    logoAccent: { color: "#3B82F6" },
    navItem: (active) => ({ padding: "0 16px", height: 60, display: "flex", alignItems: "center", fontSize: 13, fontWeight: 500, color: active ? "#60A5FA" : "#94A3B8", borderBottom: active ? "2px solid #3B82F6" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.3px", userSelect: "none" }),
    navRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
    navBtn: { padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" },
    
    ticker: { background: "rgba(59,130,246,0.08)", borderBottom: "1px solid rgba(59,130,246,0.12)", padding: "8px 32px", fontSize: "12px", color: "#60A5FA", display: "flex", alignItems: "center", gap: 12, overflow: "hidden" },
    
    hero: { padding: "72px 32px 56px", textAlign: "center", position: "relative", zIndex: 1 },
    heroLabel: { display: "inline-block", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA", padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 20 },
    heroTitle: { fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", color: "#F1F5F9", marginBottom: 20, maxWidth: 800, margin: "0 auto 20px" },
    heroSub: { fontSize: 18, color: "#64748B", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 400 },
    
    searchWrap: { maxWidth: 640, margin: "0 auto", position: "relative" },
    searchInput: { width: "100%", padding: "16px 24px 16px 52px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 12, fontSize: 16, color: "#F1F5F9", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
    searchIcon: { position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 18 },
    searchMeta: { display: "flex", justifyContent: "center", gap: 24, marginTop: 16, color: "#475569", fontSize: 13 },
    statNum: { color: "#60A5FA", fontWeight: 700 },
    
    container: { maxWidth: 1400, margin: "0 auto", padding: "0 32px 80px" },
    
    filterBar: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" },
    filterChip: (active) => ({ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", border: `1px solid ${active ? "#3B82F6" : "rgba(96,165,250,0.12)"}`, background: active ? "rgba(59,130,246,0.15)" : "transparent", color: active ? "#60A5FA" : "#64748B", userSelect: "none" }),
    filterLabel: { color: "#475569", fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginRight: 4 },
    select: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.12)", color: "#94A3B8", padding: "6px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer", outline: "none" },
    
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 },
    
    toolCard: (hovered, inCompare) => ({
      background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${inCompare ? "rgba(59,130,246,0.5)" : hovered ? "rgba(96,165,250,0.2)" : "rgba(96,165,250,0.08)"}`,
      borderRadius: 12,
      padding: 20,
      cursor: "pointer",
      transition: "all 0.2s",
      transform: hovered ? "translateY(-2px)" : "none",
      boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
      position: "relative",
      overflow: "hidden",
    }),
    
    toolHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 },
    toolLogo: { width: 44, height: 44, borderRadius: 10, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
    toolName: { fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 4 },
    toolCompany: { fontSize: 12, color: "#475569", fontWeight: 500 },
    toolDesc: { fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 14 },
    toolTags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 },
    tag: { padding: "3px 8px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: 4, fontSize: 11, color: "#475569" },
    toolFooter: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    priceTag: (price) => ({
      fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
      color: price === "Free" ? "#34D399" : price === "Freemium" ? "#60A5FA" : "#F59E0B",
    }),
    toolActions: { display: "flex", gap: 8 },
    iconBtn: (active) => ({ width: 30, height: 30, borderRadius: 6, border: `1px solid ${active ? "rgba(59,130,246,0.4)" : "rgba(96,165,250,0.1)"}`, background: active ? "rgba(59,130,246,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: active ? "#60A5FA" : "#475569", transition: "all 0.15s" }),
    trendBadge: (weekly) => {
      const pct = parseInt(weekly);
      return { fontSize: 11, fontWeight: 700, color: pct >= 20 ? "#34D399" : pct >= 10 ? "#60A5FA" : "#64748B" };
    },
    
    sectionTitle: { fontSize: 22, fontWeight: 800, color: "#F1F5F9", marginBottom: 4, letterSpacing: "-0.5px" },
    sectionSub: { fontSize: 14, color: "#475569", marginBottom: 24 },
    
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 },
    
    newsCard: (i) => ({ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.08)", borderRadius: 10, display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer", transition: "all 0.15s" }),
    newsEmoji: { fontSize: 24, flexShrink: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(59,130,246,0.08)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.15)" },
    newsTitle: { fontSize: 14, fontWeight: 600, color: "#CBD5E1", lineHeight: 1.4, marginBottom: 6 },
    newsMeta: { fontSize: 12, color: "#475569", display: "flex", gap: 8, alignItems: "center" },
    catPill: (cat) => {
      const cs = { "Model Release": "#3B82F6", "Funding": "#F59E0B", "Research": "#8B5CF6", "Open Source": "#10B981", "Milestone": "#06B6D4", "Regulation": "#EF4444" };
      return { background: `${cs[cat] || "#475569"}22`, color: cs[cat] || "#94A3B8", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" };
    },
    
    videoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
    videoCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.08)", borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" },
    videoThumb: { height: 120, background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, position: "relative", borderBottom: "1px solid rgba(96,165,250,0.1)" },
    videoPlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", fontSize: 32 },
    videoInfo: { padding: 12 },
    videoTitle: { fontSize: 13, fontWeight: 600, color: "#CBD5E1", lineHeight: 1.4, marginBottom: 8 },
    videoMeta: { fontSize: 11, color: "#475569", display: "flex", gap: 8 },
    
    modelTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: { padding: "10px 14px", background: "rgba(96,165,250,0.06)", color: "#64748B", fontWeight: 600, textAlign: "left", fontSize: 11, letterSpacing: "0.5px", textTransform: "uppercase", borderBottom: "1px solid rgba(96,165,250,0.1)" },
    td: { padding: "12px 14px", borderBottom: "1px solid rgba(96,165,250,0.06)", color: "#CBD5E1", verticalAlign: "middle" },
    
    compareBar: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 14, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
    compareBtn: { padding: "8px 20px", background: "#3B82F6", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" },
    
    compareModal: { position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
    compareContent: { background: "#0F172A", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 16, padding: 32, maxWidth: 900, width: "100%", maxHeight: "80vh", overflowY: "auto" },
    
    statCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.08)", borderRadius: 10, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 6 },
    statVal: { fontSize: 28, fontWeight: 800, color: "#60A5FA", letterSpacing: "-1px" },
    statLabel: { fontSize: 12, color: "#475569", fontWeight: 500 },
    
    divider: { height: 1, background: "rgba(96,165,250,0.08)", margin: "40px 0" },
    
    scoreBar: (val, max, color) => ({
      height: 4, borderRadius: 2, width: `${(val / max) * 100}%`, background: color, transition: "width 0.5s ease"
    }),
    scoreTrack: { height: 4, borderRadius: 2, background: "rgba(96,165,250,0.1)", flex: 1 },
  };

  const navItems = [
    { id: "discover", label: "Discover" },
    { id: "models", label: "LLM Models" },
    { id: "news", label: "News" },
    { id: "videos", label: "Videos" },
    { id: "compare", label: "Compare" },
  ];

  return (
    <div style={styles.app}>
      <div style={styles.grid} />
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      {/* NEWS TICKER */}
      <div style={styles.ticker}>
        <span style={{ fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontSize: 10, background: "#3B82F6", color: "white", padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>LIVE</span>
        <span style={{ transition: "opacity 0.5s" }}>
          {NEWS[ticker].img} {NEWS[ticker].title}
        </span>
        <span style={{ marginLeft: "auto", flexShrink: 0, color: "#475569", fontSize: 11 }}>{NEWS[ticker].source} · {NEWS[ticker].time}</span>
      </div>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => setActiveNav("discover")}>
          <span style={{ fontSize: 22 }}>◈</span>
          <span>AI<span style={styles.logoAccent}>Nexus</span></span>
        </div>
        {navItems.map(item => (
          <div key={item.id} style={styles.navItem(activeNav === item.id)} onClick={() => setActiveNav(item.id)}>
            {item.label}
            {item.id === "compare" && compareList.length > 0 && (
              <span style={{ marginLeft: 6, background: "#3B82F6", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{compareList.length}</span>
            )}
          </div>
        ))}
        <div style={styles.navRight}>
          <button style={{ ...styles.navBtn, background: "transparent", border: "1px solid rgba(96,165,250,0.2)", color: "#94A3B8" }}>Sign In</button>
          <button style={{ ...styles.navBtn, background: "#3B82F6", border: "none", color: "white" }}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      {activeNav === "discover" && (
        <div style={styles.hero}>
          <div style={styles.heroLabel}>The Complete AI Intelligence Hub</div>
          <h1 style={styles.heroTitle}>Every AI Tool, Model<br />&amp; Resource. One Place.</h1>
          <p style={styles.heroSub}>Discover, compare, and track the entire AI ecosystem — tools, LLMs, platforms, news, and videos — updated daily.</p>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              style={styles.searchInput}
              placeholder="Search tools, models, use cases... (e.g. 'image generation', 'code assistant')"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(96,165,250,0.2)"}
            />
          </div>
          <div style={styles.searchMeta}>
            <span><span style={styles.statNum}>4,200+</span> AI Tools</span>
            <span>·</span>
            <span><span style={styles.statNum}>80+</span> LLM Models</span>
            <span>·</span>
            <span><span style={styles.statNum}>Daily</span> News</span>
            <span>·</span>
            <span><span style={styles.statNum}>500+</span> Video Guides</span>
          </div>
        </div>
      )}

      {/* ==================== DISCOVER ==================== */}
      {activeNav === "discover" && (
        <div style={styles.container}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 40 }}>
            {[
              { val: "4,287", label: "Tools Catalogued", sub: "+23 this week" },
              { val: "82", label: "Foundation Models", sub: "Tracked & benchmarked" },
              { val: "1.2M", label: "Monthly Visitors", sub: "Growing community" },
              { val: "99%", label: "Uptime SLA", sub: "Real-time data sync" },
            ].map((s, i) => (
              <div key={i} style={styles.statCard}>
                <div style={styles.statVal}>{s.val}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>{s.label}</div>
                <div style={styles.statLabel}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={styles.filterBar}>
            <span style={styles.filterLabel}>Category</span>
            {CATEGORIES.map(cat => (
              <div key={cat} style={styles.filterChip(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>{cat}</div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={styles.filterLabel}>Price</span>
              <select style={styles.select} value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                {["All", "Free", "Freemium", "Paid"].map(p => <option key={p}>{p}</option>)}
              </select>
              <span style={styles.filterLabel}>Sort</span>
              <select style={styles.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div style={{ marginBottom: 16, color: "#475569", fontSize: 13 }}>
            Showing <span style={{ color: "#60A5FA", fontWeight: 600 }}>{filteredTools.length}</span> tools
            {compareList.length > 0 && <span style={{ marginLeft: 16, color: "#F59E0B" }}>· {compareList.length} selected for comparison</span>}
          </div>

          {/* Tool Grid */}
          <div style={styles.grid2}>
            {filteredTools.map(tool => (
              <div
                key={tool.id}
                style={styles.toolCard(hoveredTool === tool.id, compareList.find(t => t.id === tool.id))}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                {/* Subtle shimmer for featured */}
                {tool.featured && (
                  <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent)", borderRadius: "0 12px 0 0" }} />
                )}
                <div style={styles.toolHeader}>
                  <div style={styles.toolLogo}>{tool.logo}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={styles.toolName}>{tool.name}</span>
                      <Badge text={tool.badge} />
                    </div>
                    <div style={styles.toolCompany}>{tool.company} · {tool.category}</div>
                  </div>
                </div>
                <p style={styles.toolDesc}>{tool.description}</p>
                <div style={styles.toolTags}>
                  {tool.tags.map(tag => <span key={tag} style={styles.tag}>#{tag}</span>)}
                  {tool.api && <span style={{ ...styles.tag, color: "#60A5FA", borderColor: "rgba(96,165,250,0.2)" }}>API</span>}
                  {tool.opensource && <span style={{ ...styles.tag, color: "#34D399", borderColor: "rgba(52,211,153,0.2)" }}>Open Source</span>}
                </div>
                <div style={styles.toolFooter}>
                  <div>
                    <StarRating rating={tool.rating} />
                    <div style={{ marginTop: 4, fontSize: 11, color: "#475569" }}>{tool.reviews.toLocaleString()} reviews · <span style={styles.trendBadge(tool.weekly)}>{tool.weekly} this week</span></div>
                  </div>
                  <div style={styles.toolActions}>
                    <div style={{ ...styles.priceTag(tool.price), marginRight: 8, display: "flex", alignItems: "center" }}>{tool.price}</div>
                    <div style={styles.iconBtn(saved.includes(tool.id))} onClick={e => { e.stopPropagation(); toggleSave(tool.id); }} title="Save">
                      {saved.includes(tool.id) ? "♥" : "♡"}
                    </div>
                    <div style={styles.iconBtn(compareList.find(t => t.id === tool.id))} onClick={e => { e.stopPropagation(); toggleCompare(tool); }} title="Compare">
                      ⇄
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODELS ==================== */}
      {activeNav === "models" && (
        <div style={styles.container}>
          <div style={{ paddingTop: 40, marginBottom: 32 }}>
            <div style={styles.sectionTitle}>Foundation Models Intelligence</div>
            <div style={styles.sectionSub}>Track all major LLMs with benchmarks, pricing, context windows, and capabilities — updated in real time.</div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.08)", borderRadius: 12, overflow: "hidden" }}>
            <table style={styles.modelTable}>
              <thead>
                <tr>
                  {["Model", "Company", "Context", "MMLU ↑", "HumanEval ↑", "Arena Score ↑", "Price In / Out", "Type"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODELS.map((m, i) => (
                  <tr key={m.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 700, color: "#F1F5F9", marginBottom: 2 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>Released {m.release}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: "#94A3B8" }}>{m.company}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: "#60A5FA", fontWeight: 700, fontFamily: "monospace" }}>{m.context}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: m.mmlu > 88 ? "#34D399" : "#CBD5E1" }}>{m.mmlu}</span>
                        <div style={styles.scoreTrack}><div style={styles.scoreBar(m.mmlu, 100, m.mmlu > 88 ? "#34D399" : "#60A5FA")} /></div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: m.humaneval > 90 ? "#34D399" : "#CBD5E1" }}>{m.humaneval}</span>
                        <div style={styles.scoreTrack}><div style={styles.scoreBar(m.humaneval, 100, m.humaneval > 90 ? "#34D399" : "#8B5CF6")} /></div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 800, color: "#F59E0B", fontFamily: "monospace" }}>{m.arena}</span>
                    </td>
                    <td style={styles.td}>
                      {m.opensource ? (
                        <span style={{ color: "#34D399", fontWeight: 600, fontSize: 12 }}>Free / Open Source</span>
                      ) : (
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#94A3B8" }}>
                          ${m.price_in.toFixed(2)} / <span style={{ color: "#CBD5E1" }}>${m.price_out.toFixed(2)}</span>
                          <span style={{ color: "#475569", fontSize: 10, display: "block" }}>per 1M tokens</span>
                        </span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {m.opensource && <span style={{ ...styles.tag, color: "#34D399", borderColor: "rgba(52,211,153,0.2)", fontSize: 10 }}>Open</span>}
                        {m.multimodal && <span style={{ ...styles.tag, color: "#A78BFA", borderColor: "rgba(167,139,250,0.2)", fontSize: 10 }}>Multimodal</span>}
                        {!m.multimodal && <span style={{ ...styles.tag, fontSize: 10 }}>Text Only</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, color: "#475569", fontSize: 12 }}>
            * Arena scores from LMSYS Chatbot Arena. Benchmarks as of latest evaluation. Prices in USD per million tokens.
          </div>
        </div>
      )}

      {/* ==================== NEWS ==================== */}
      {activeNav === "news" && (
        <div style={styles.container}>
          <div style={{ paddingTop: 40, marginBottom: 32 }}>
            <div style={styles.sectionTitle}>AI News Intelligence</div>
            <div style={styles.sectionSub}>Curated from 200+ sources — model releases, funding rounds, research papers, policy changes, and industry milestones.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontWeight: 600, color: "#60A5FA", fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>Latest Stories</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {NEWS.map((item, i) => (
                  <div key={item.id} style={{ ...styles.newsCard(i), border: item.hot ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(96,165,250,0.08)", background: item.hot ? "rgba(249,115,22,0.04)" : "rgba(255,255,255,0.02)" }}>
                    <div style={styles.newsEmoji}>{item.img}</div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.newsTitle}>
                        {item.hot && <span style={{ color: "#F97316", marginRight: 6, fontSize: 12 }}>🔥</span>}
                        {item.title}
                      </div>
                      <div style={styles.newsMeta}>
                        <span style={styles.catPill(item.category)}>{item.category}</span>
                        <span>{item.source}</span>
                        <span>·</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 18, color: "#475569", alignSelf: "center" }}>›</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "#60A5FA", fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}>By Category</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Model Release", "Funding", "Research", "Open Source", "Regulation", "Milestone"].map(cat => {
                  const count = NEWS.filter(n => n.category === cat).length;
                  const colors = { "Model Release": "#3B82F6", "Funding": "#F59E0B", "Research": "#8B5CF6", "Open Source": "#10B981", "Regulation": "#EF4444", "Milestone": "#06B6D4" };
                  return (
                    <div key={cat} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.08)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                      <span style={{ color: colors[cat] || "#94A3B8", fontWeight: 600, fontSize: 13 }}>{cat}</span>
                      <span style={{ background: `${colors[cat] || "#475569"}22`, color: colors[cat] || "#94A3B8", padding: "2px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 24, padding: 20, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 10 }}>
                <div style={{ fontWeight: 700, color: "#60A5FA", marginBottom: 8, fontSize: 14 }}>📧 Daily AI Digest</div>
                <div style={{ color: "#64748B", fontSize: 13, marginBottom: 12 }}>Get the top AI news delivered every morning. No spam, unsubscribe anytime.</div>
                <input placeholder="your@email.com" style={{ ...styles.searchInput, padding: "10px 14px", fontSize: 13, marginBottom: 8 }} />
                <button style={{ ...styles.compareBtn, width: "100%", padding: "10px" }}>Subscribe Free</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIDEOS ==================== */}
      {activeNav === "videos" && (
        <div style={styles.container}>
          <div style={{ paddingTop: 40, marginBottom: 32 }}>
            <div style={styles.sectionTitle}>AI Video Library</div>
            <div style={styles.sectionSub}>Curated tutorials, reviews, and comparisons from the best AI YouTube channels. All in one place.</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {["All", "Tutorial", "Comparison", "Code", "Image AI", "Pricing", "Local AI"].map(cat => (
              <div key={cat} style={styles.filterChip(cat === "All")}>{cat}</div>
            ))}
          </div>

          <div style={styles.videoGrid}>
            {VIDEOS.map(v => (
              <div key={v.id} style={styles.videoCard}
                onMouseEnter={e => e.currentTarget.querySelector('.play-overlay').style.opacity = 1}
                onMouseLeave={e => e.currentTarget.querySelector('.play-overlay').style.opacity = 0}
              >
                <div style={styles.videoThumb}>
                  <span style={{ fontSize: 36 }}>{v.thumb}</span>
                  <div className="play-overlay" style={styles.videoPlay}>▶</div>
                </div>
                <div style={styles.videoInfo}>
                  <div style={styles.videoTitle}>{v.title}</div>
                  <div style={styles.videoMeta}>
                    <span style={{ color: "#60A5FA", fontWeight: 600 }}>{v.channel}</span>
                    <span>·</span>
                    <span>{v.views} views</span>
                    <span>·</span>
                    <span>{v.time}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={styles.catPill(v.category)}>{v.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== COMPARE ==================== */}
      {activeNav === "compare" && (
        <div style={styles.container}>
          <div style={{ paddingTop: 40, marginBottom: 32 }}>
            <div style={styles.sectionTitle}>Tool Comparison Engine</div>
            <div style={styles.sectionSub}>Side-by-side comparison of any AI tools. Select up to 3 tools from the Discover tab or search below.</div>
          </div>

          {compareList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#475569" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⇄</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>No tools selected</div>
              <div style={{ fontSize: 14 }}>Go to the Discover tab and click the ⇄ icon on any tool to add it here</div>
              <button style={{ ...styles.compareBtn, marginTop: 24 }} onClick={() => setActiveNav("discover")}>Browse Tools</button>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: `200px ${compareList.map(() => "1fr").join(" ")}`, gap: 0, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: 12, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: 16, borderBottom: "1px solid rgba(96,165,250,0.08)", borderRight: "1px solid rgba(96,165,250,0.08)" }} />
                {compareList.map(tool => (
                  <div key={tool.id} style={{ padding: 20, borderBottom: "1px solid rgba(96,165,250,0.08)", borderRight: "1px solid rgba(96,165,250,0.08)", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{tool.logo}</div>
                    <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 16 }}>{tool.name}</div>
                    <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>{tool.company}</div>
                    <Badge text={tool.badge} />
                  </div>
                ))}

                {/* Rows */}
                {[
                  { label: "Rating", key: "rating", format: r => <StarRating rating={r} /> },
                  { label: "Reviews", key: "reviews", format: r => <span style={{ color: "#60A5FA", fontWeight: 700 }}>{r.toLocaleString()}</span> },
                  { label: "Pricing", key: "price", format: p => <span style={{ ...styles.priceTag(p) }}>{p}</span> },
                  { label: "Category", key: "category", format: c => c },
                  { label: "Model", key: "model", format: m => <span style={{ fontFamily: "monospace", fontSize: 12, color: "#A78BFA" }}>{m}</span> },
                  { label: "API Access", key: "api", format: v => v ? <span style={{ color: "#34D399" }}>✓ Yes</span> : <span style={{ color: "#EF4444" }}>✗ No</span> },
                  { label: "Open Source", key: "opensource", format: v => v ? <span style={{ color: "#34D399" }}>✓ Yes</span> : <span style={{ color: "#EF4444" }}>✗ No</span> },
                  { label: "Weekly Growth", key: "weekly", format: w => <span style={styles.trendBadge(w)}>{w}</span> },
                ].map(row => (
                  <React.Fragment key={row.label}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(96,165,250,0.06)", borderRight: "1px solid rgba(96,165,250,0.08)", color: "#64748B", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center" }}>{row.label}</div>
                    {compareList.map(tool => (
                      <div key={tool.id} style={{ padding: "14px 16px", borderBottom: "1px solid rgba(96,165,250,0.06)", borderRight: "1px solid rgba(96,165,250,0.08)", textAlign: "center", fontSize: 13, color: "#CBD5E1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {row.format(tool[row.key])}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <button style={{ ...styles.compareBtn, marginTop: 16, background: "transparent", border: "1px solid rgba(96,165,250,0.2)", color: "#64748B" }} onClick={() => setCompareList([])}>Clear Comparison</button>
            </div>
          )}
        </div>
      )}

      {/* COMPARE BAR */}
      {compareList.length > 0 && activeNav !== "compare" && (
        <div style={styles.compareBar}>
          <span style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>Comparing:</span>
          {compareList.map(t => (
            <span key={t.id} style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA", padding: "4px 12px", borderRadius: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              {t.logo} {t.name}
              <span style={{ cursor: "pointer", opacity: 0.6 }} onClick={() => toggleCompare(t)}>×</span>
            </span>
          ))}
          <button style={styles.compareBtn} onClick={() => setActiveNav("compare")}>Compare Now →</button>
        </div>
      )}
    </div>
  );
}
