"use client";

import React, { useEffect, useState } from "react";
import { getLiveMetrics } from "@/app/actions";
import { Activity, Cpu, Zap, TrendingUp } from "lucide-react";

interface Metric {
    model_name: string;
    latency_ms: number;
    tokens_per_second: number;
}

export default function LivePulse() {
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        // Initial fetch
        getLiveMetrics().then(setMetrics);

        // Poll every 10 seconds for updates (simulate "live" feel)
        const interval = setInterval(() => {
            getLiveMetrics().then(setMetrics);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (metrics.length === 0) return null;

    return (
        <div style={{
            background: "rgba(12,10,9,0.8)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(16px)",
            height: 44,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            zIndex: 50
        }}>
            <div style={{
                padding: "0 20px",
                borderRight: "1px solid var(--border)",
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 11,
                fontWeight: 900,
                color: "var(--accent)",
                whiteSpace: "nowrap",
                zIndex: 10,
                background: "rgba(12,10,9,0.9)",
                letterSpacing: "1px",
                textTransform: "uppercase"
            }}>
                <div style={{
                    width: 6, height: 6, background: "#22C55E", borderRadius: "50%",
                    boxShadow: "0 0 10px #22C55E", animation: "pulse 2s infinite"
                }} />
                <Activity size={14} />
                LIVE PULSE
            </div>

            <div className="marquee-container" style={{
                display: "flex",
                gap: 40,
                padding: "0 32px",
                whiteSpace: "nowrap"
            }}>
                {metrics.map((m) => (
                    <div key={m.model_name} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--muted)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Cpu size={12} style={{ opacity: 0.5 }} />
                            <span style={{ fontWeight: 800, color: "#FFF", letterSpacing: "-0.3px" }}>{m.model_name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Zap size={12} style={{ color: m.latency_ms < 200 ? "#34D399" : m.latency_ms < 500 ? "var(--accent)" : "#EF4444" }} />
                            <span style={{ fontWeight: 700, color: m.latency_ms < 200 ? "#34D399" : m.latency_ms < 500 ? "var(--accent)" : "#EF4444" }}>
                                {m.latency_ms}ms
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.6 }}>
                            <TrendingUp size={12} />
                            <span style={{ fontSize: 11, fontWeight: 700 }}>
                                {m.tokens_per_second} <span style={{ fontSize: 9 }}>T/S</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .marquee-container {
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.6; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.6; }
                }
            `}</style>
        </div>
    );
}
