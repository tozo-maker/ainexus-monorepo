'use client';

import React from 'react';
import { History, TrendingUp, TrendingDown, RefreshCcw, ArrowRight } from 'lucide-react';

interface PricingChange {
    old_pricing: string;
    new_pricing: string;
    change_summary: string;
    created_at: string;
}

export default function PricingHistory({ history }: { history: PricingChange[] }) {
    if (!history || history.length === 0) {
        return (
            <div style={{ color: "var(--muted)", fontSize: 15, padding: "24px 0" }}>
                No pricing/feature changes have been detected for this intelligence protocol yet. Our automated crawlers check for updates weekly.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: "12px 0" }}>
            {history.map((item, idx) => {
                const date = new Date(item.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                });

                return (
                    <div key={idx} style={{
                        borderLeft: "2px solid var(--border)",
                        paddingLeft: 24,
                        position: "relative"
                    }}>
                        <div style={{
                            position: "absolute",
                            left: -17,
                            top: 0,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--background)",
                            border: "2px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent)"
                        }}>
                            <History size={14} />
                        </div>

                        <div style={{ marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{date}</span>
                        </div>

                        {(item.old_pricing !== item.new_pricing) && (
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, fontSize: 15, fontWeight: 600 }}>
                                <span style={{ color: "var(--muted)", textDecoration: "line-through" }}>{item.old_pricing || "Unknown"}</span>
                                <ArrowRight size={14} style={{ color: "var(--muted)" }} />
                                <span style={{ color: "var(--foreground)" }}>{item.new_pricing}</span>
                            </div>
                        )}

                        <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--foreground)", background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                            {item.change_summary}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
