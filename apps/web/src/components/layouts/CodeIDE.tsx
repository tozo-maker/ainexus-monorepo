"use client";
import React, { useState } from "react";
// @ts-ignore
import { ToolCard } from "@/components/ToolCard";

export default function CodeIDE({ tools, onExit }: { tools: any[], onExit?: () => void }) {
    const [activeFile, setActiveFile] = useState("main.py");
    const [code, setCode] = useState(`import os
from nexus_ai import Agent

def main():
    agent = Agent(model="gpt-4o")
    result = agent.run("Analyze the latest crypto trends")
    print(result)

if __name__ == "__main__":
    main()`);
    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        setOutput(prev => [...prev, "> Running main.py..."]);

        setTimeout(() => {
            setIsRunning(false);
            setOutput(prev => [...prev, " [Nexus Agent] Analyzing market data...", " [Nexus Agent] Trend confirmed: Bullish on AI tokens.", "> Done in 1.2s"]);
        }, 1500);
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#0D1117", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: "#C9D1D9", overflow: "hidden" }}>

            {/* Sidebar */}
            <div style={{ width: 250, borderRight: "1px solid #30363D", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#8B949E", letterSpacing: 1 }}>EXPLORER</div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                    <div style={{ padding: "4px 0" }}>
                        <div style={{ padding: "4px 16px", color: "#8B949E", fontSize: 13 }}>NEXUS-PROJECT</div>
                        <div
                            style={{ padding: "4px 16px 4px 28px", background: activeFile === "main.py" ? "#161B22" : "transparent", color: activeFile === "main.py" ? "#58A6FF" : "#C9D1D9", cursor: "pointer", display: "flex", alignItems: "center" }}
                            onClick={() => setActiveFile("main.py")}
                        >
                            <span style={{ marginRight: 6 }}>🐍</span> main.py
                        </div>
                        <div style={{ padding: "4px 16px 4px 28px", cursor: "pointer", color: "#8B949E" }}><span style={{ marginRight: 6 }}>📝</span> README.md</div>
                        <div style={{ padding: "4px 16px 4px 28px", cursor: "pointer", color: "#8B949E" }}><span style={{ marginRight: 6 }}>⚙️</span> config.json</div>
                    </div>
                </div>
                {onExit && (
                    <div style={{ padding: 16, borderTop: "1px solid #30363D" }}>
                        <button onClick={onExit} style={{ width: "100%", background: "#21262D", border: "1px solid #30363D", color: "#C9D1D9", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                            ← Exit IDE
                        </button>
                    </div>
                )}
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* Tabs */}
                <div style={{ display: "flex", height: 35, background: "#010409", borderBottom: "1px solid #30363D" }}>
                    <div style={{ padding: "0 16px", height: "100%", display: "flex", alignItems: "center", background: "#0D1117", borderRight: "1px solid #30363D", borderTop: "1px solid #F9826C", color: "#C9D1D9", fontSize: 13 }}>
                        {activeFile}
                    </div>
                </div>

                {/* Editor */}
                <div style={{ flex: 1, position: "relative" }}>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "#0D1117",
                            color: "#C9D1D9",
                            border: "none",
                            padding: 20,
                            lineHeight: 1.5,
                            fontFamily: "inherit",
                            fontSize: 14,
                            resize: "none",
                            outline: "none"
                        }}
                        spellCheck={false}
                    />

                    {/* Run Button Overlay */}
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            background: isRunning ? "#238636" : "#238636",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            opacity: isRunning ? 0.7 : 1
                        }}
                    >
                        <span style={{ marginRight: 6 }}>▶</span> {isRunning ? "Running..." : "Run Code"}
                    </button>
                </div>

                {/* Terminal */}
                <div style={{ height: 200, background: "#010409", borderTop: "1px solid #30363D", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", padding: "8px 16px", borderBottom: "1px solid #30363D" }}>
                        <span style={{ fontSize: 12, color: "#8B949E", marginRight: 16, borderBottom: "1px solid #F9826C", paddingBottom: 8 }}>TERMINAL</span>
                        <span style={{ fontSize: 12, color: "#8B949E", marginRight: 16 }}>OUTPUT</span>
                    </div>
                    <div style={{ flex: 1, padding: 16, overflowY: "auto", fontSize: 13, color: "#8B949E", fontFamily: "monospace" }}>
                        <div style={{ color: "#7EE787" }}>root@nexus:~/project# python3 main.py</div>
                        {output.map((line, i) => (
                            <div key={i} style={{ marginTop: 4, color: line.startsWith(">") ? "#7EE787" : "#C9D1D9" }}>{line}</div>
                        ))}
                        {isRunning && <div style={{ marginTop: 4 }}>_</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

