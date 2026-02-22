"use client";
import React, { useState } from "react";
// @ts-ignore
import ToolCard from "../ToolCard";

export default function VideoDashboard({ tools }: { tools: any[] }) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Mock generation
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedVideos(prev => [{
                id: Date.now(),
                name: `Generated: ${prompt.substring(0, 15)}...`,
                status: "Ready",
                description: prompt
            }, ...prev]);
            setPrompt("");
        }, 3000);
    };

    return (
        <div style={{ padding: "40px", background: "#080808", minHeight: "100vh", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", background: "linear-gradient(to right, #F472B6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
                        Studio Mode
                    </h2>
                    <p style={{ color: "#64748B", margin: "8px 0 0 0" }}>Generative Video Workflow</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ padding: "8px 16px", background: "#1F2937", borderRadius: 8, fontSize: 14 }}>
                        Credits: <span style={{ color: "#4ADE80" }}>450</span>
                    </div>
                </div>
            </div>

            {/* Prompt Area */}
            <div style={{ marginBottom: 40, background: "#111827", padding: 20, borderRadius: 16, border: "1px solid #374151" }}>
                <div style={{ display: "flex", gap: 12 }}>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe a scene to generate..."
                        style={{ flex: 1, background: "transparent", border: "none", color: "white", fontSize: 16, outline: "none" }}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        style={{
                            background: isGenerating ? "#4B5563" : "#8B5CF6",
                            color: "white",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: 8,
                            cursor: isGenerating ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            transition: "all 0.2s"
                        }}
                    >
                        {isGenerating ? "Generating..." : "Generate"}
                    </button>
                </div>
            </div>

            {/* Generated & Tools Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>

                {/* Newly Generated Items */}
                {generatedVideos.map(video => (
                    <div key={video.id} style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", border: "1px solid #8B5CF6", boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}>
                        <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid #8B5CF6", marginLeft: 4 }} />
                            </div>
                            <span style={{ color: "#A78BFA", fontSize: 14 }}>New Creation</span>
                        </div>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(to top, black, transparent)" }}>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>{video.name}</div>
                        </div>
                    </div>
                ))}

                {/* Existing Tools */}
                {tools.map(tool => (
                    <div key={tool.id} style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", border: "1px solid #333", opacity: isGenerating ? 0.5 : 1, transition: "opacity 0.3s" }}>
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(45deg, #111, #222)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid white", marginLeft: 4 }} />
                            </div>
                        </div>

                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, background: "linear-gradient(to top, black, transparent)" }}>
                            <div style={{ fontWeight: 700, fontSize: 18 }}>{tool.name}</div>
                            <div style={{ fontSize: 13, color: "#94A3B8" }}>Generative Video • {tool.pricing}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

