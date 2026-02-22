"use client";

import React from "react";
import { Sparkles } from "lucide-react";
// @ts-ignore
import ToolCard from "./ToolCard";

export default function SimilarTools({ tools }: { tools: any[] }) {
    // In a real app, these would connect to a global store (Zustand/Context)
    // For now, we keep them local/dummy since this is an isolated detail page
    const handleToggleSave = (id: string) => {
        console.log("Toggle save:", id);
    };

    const handleToggleCompare = (tool: any) => {
        console.log("Toggle compare:", tool.name);
    };

    const styles = {
        sectionTitle: {
            fontSize: 24,
            fontWeight: 900,
            color: "var(--foreground)",
            marginBottom: 32,
            marginTop: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            letterSpacing: "-0.5px",
            fontFamily: "var(--font-mono)"
        },
        grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 },
    };

    if (tools.length === 0) return null;

    return (
        <>
            <div style={styles.sectionTitle}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(202,138,4,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                    <Sparkles size={20} />
                </div>
                Similar Intelligence
            </div>
            <div style={styles.grid}>
                {tools.map((t: any) => (
                    <ToolCard
                        key={t.id}
                        tool={t}
                        onToggleSave={handleToggleSave}
                        onToggleCompare={handleToggleCompare}
                    />
                ))}
            </div>
        </>
    );
}
