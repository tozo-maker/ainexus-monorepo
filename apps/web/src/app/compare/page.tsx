import { Metadata } from 'next';
import SharedNavbar from '@/components/SharedNavbar';
import { Repeat } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Intelligence Matrix & AI Comparison | AINexus",
    description: "Architectural breakdown and side-by-side performance benchmarks for top AI platforms and models.",
    openGraph: {
        title: "Intelligence Matrix & AI Comparison | AINexus",
        description: "Side-by-side performance benchmarks for AI.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Intelligence Matrix & AI Comparison",
        description: "Side-by-side performance benchmarks for AI.",
    }
};

export default function ComparePage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(79,70,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

            <SharedNavbar />

            <div style={{ maxWidth: 1920, width: "100%", margin: "0 auto", padding: "0 32px 100px", boxSizing: "border-box", position: "relative", zIndex: 1 }}>
                <div style={{ paddingTop: 40, marginBottom: 40 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "var(--foreground)", marginBottom: 8, letterSpacing: "-1px", fontFamily: "var(--font-display)" }}>Intelligence Matrix</div>
                    <div style={{ fontSize: 16, color: "var(--muted)", marginBottom: 32, lineHeight: 1.5, fontWeight: 400 }}>Architectural breakdown and side-by-side performance benchmarks.</div>
                </div>

                <div style={{ textAlign: "center", padding: "120px 20px", background: "rgba(28,25,23,0.3)", borderRadius: 24, border: "1px dotted var(--border)" }}>
                    <div style={{ background: "rgba(202,138,4,0.1)", width: 64, height: 64, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--accent)" }}>
                        <Repeat size={32} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#FFF", marginBottom: 8, letterSpacing: "-0.5px" }}>Matrix is Empty</div>
                    <div style={{ fontSize: 14, color: "var(--muted)", maxWidth: 300, margin: "0 auto 32px", lineHeight: 1.5 }}>Select up to 3 models or tools from the intelligence catalog to begin architectural comparison.</div>

                    <Link href="/" passHref legacyBehavior>
                        <a style={{ padding: "8px 20px", background: "var(--foreground)", color: "#FFF", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "var(--transition)", display: "inline-block", textDecoration: "none" }}>
                            Initialize Catalog
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
