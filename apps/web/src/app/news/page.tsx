import { Metadata } from 'next';
import { getNews } from '@/app/actions';
import SharedNavbar from '@/components/SharedNavbar';
import he from 'he';
import { Newspaper, ChevronRight, Zap, Activity, Cpu, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: "AI Newsroom & Intelligence Feed | AINexus",
    description: "Curated industry intelligence, funding announcements, model releases, and research updates from 200+ global sources.",
    openGraph: {
        title: "AI Newsroom | AINexus",
        description: "Real-time AI industry news, funding, and releases.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Newsroom & Intelligence Feed | AINexus",
        description: "Real-time AI industry news, funding, and releases.",
    }
};

export default async function NewsPage() {
    const NEWS = await getNews();

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(79,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

            <SharedNavbar />

            <div style={{ maxWidth: 1920, width: "100%", margin: "0 auto", padding: "0 32px 100px", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
                <div style={{ paddingTop: 40, marginBottom: 40 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "var(--foreground)", marginBottom: 8, letterSpacing: "-1px", fontFamily: "var(--font-display)" }}>Intelligence Feed</div>
                    <div style={{ fontSize: 16, color: "var(--muted)", marginBottom: 32, lineHeight: 1.5, fontWeight: 400 }}>Curated industry intelligence from 200+ global sources — updated every 15 minutes.</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                    <div>
                        <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 20 }}>LATEST DISPATCHES</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {NEWS.map((item: any, i: number) => (
                                <button key={item.id} style={{
                                    padding: "16px", background: item.hot ? "rgba(202,138,4,0.05)" : "var(--background)",
                                    border: item.hot ? "1px solid rgba(202,138,4,0.3)" : "1px solid var(--border)",
                                    borderRadius: 12, display: "flex", gap: 16, alignItems: "center", cursor: "pointer",
                                    transition: "var(--transition)", marginBottom: 12, boxShadow: "var(--shadow-sm)",
                                    width: "100%", textAlign: "left"
                                }}>
                                    <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary)", borderRadius: 8, color: "var(--accent)" }}>
                                        {item.category === "Model Release" ? <Zap size={20} /> :
                                            item.category === "Funding" ? <Activity size={20} /> :
                                                item.category === "Research" ? <Cpu size={20} /> : <Newspaper size={20} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.4, marginBottom: 4 }}>
                                            {item.hot && <span style={{ color: "var(--accent)", marginRight: 8, fontSize: 12 }}>🔥</span>}
                                            {he.decode(item.title)}
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, alignItems: "center" }}>
                                            <span style={{ background: "var(--primary)", color: "var(--muted)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{item.category}</span>
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
                                <input placeholder="professional@email.com" style={{ width: "100%", padding: "12px 16px", background: "rgba(12,10,9,0.4)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 14, color: "var(--foreground)", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
                                <button style={{ padding: "8px 20px", background: "var(--foreground)", color: "#FFF", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%" }}>Subscribe Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
