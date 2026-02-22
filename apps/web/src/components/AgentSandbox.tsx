"use client";

import React, { useState } from "react";
import { runAgentAction } from "@/app/actions";
import { Terminal, Globe, Command, Play, Monitor, AlertCircle, Loader2, ChevronRight } from "lucide-react";

export default function AgentSandbox({ toolUrl, toolName }: { toolUrl?: string, toolName?: string }) {
    const [prompt, setPrompt] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRun = async () => {
        if (!toolUrl) return;
        setIsLoading(true);
        setLogs(prev => [...prev, `[SYSTEM] Initializing autonomous agent for ${toolName}...`]);
        setLogs(prev => [...prev, `[SYSTEM] Target Protocol: ${toolUrl}`]);

        try {
            // Simulated steps for UI feedback
            setTimeout(() => setLogs(p => [...p, "[EXEC] Initializing headless runtime environment..."]), 500);
            setTimeout(() => setLogs(p => [...p, "[EXEC] Establishing secure connection to target..."]), 1500);

            const result = await runAgentAction(toolUrl, prompt);

            if (result.success && result.screenshot) {
                setScreenshot(result.screenshot);
                setLogs(prev => [...prev, `[COMPLETE] Protocol successful. Visual data captured.`]);
            } else {
                setLogs(prev => [...prev, `[FAIL] Error encountered: ${result.error}`]);
            }
        } catch (e) {
            setLogs(prev => [...prev, `[CRITICAL] Neural link termination. Hardware failure simulator initiated.`]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            background: "rgba(12,10,9,0.9)",
            borderRadius: 24,
            border: "1px solid var(--border)",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 64px -16px rgba(0,0,0,0.5)"
        }}>
            {/* Header */}
            <div style={{
                background: "rgba(28,25,23,0.6)", padding: "16px 24px", borderBottom: "1px solid var(--border)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12, borderLeft: "1px solid var(--border)", paddingLeft: 16 }}>
                        <Terminal size={14} style={{ color: "var(--accent)" }} />
                        <span style={{ color: "#FFF", fontSize: 11, fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase" }}>Autonomous Sandbox v2.0</span>
                    </div>
                </div>
                {isLoading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", fontSize: 10, fontWeight: 900, letterSpacing: "1px" }}>
                        <Loader2 size={12} className="animate-spin" />
                        PROCESSING COMMAND
                    </div>
                )}
            </div>

            {/* Split View */}
            <div style={{ display: "flex", height: 480 }}>
                {/* Controls & Logs */}
                <div style={{ flex: 1, padding: 32, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <Globe size={12} style={{ color: "var(--muted)" }} />
                            <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Synchronized Target</span>
                        </div>
                        <div style={{ background: "rgba(12,10,9,0.4)", border: "1px solid var(--border)", padding: "12px 16px", borderRadius: 12, color: "var(--accent)", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                            {toolUrl || "Awaiting target assignment..."}
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <Command size={12} style={{ color: "var(--muted)" }} />
                            <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Neural Instruction</span>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                                <ChevronRight size={14} style={{ position: "absolute", left: 12, color: "var(--accent)" }} />
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder='Execute: "Capture full overview"'
                                    style={{
                                        width: "100%", background: "rgba(12,10,9,0.4)", border: "1px solid var(--border)",
                                        borderRadius: 12, padding: "12px 16px 12px 32px", color: "white", outline: "none",
                                        fontSize: 14, fontWeight: 500, transition: "all 0.2s", fontFamily: "var(--font-mono)"
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                            <button
                                onClick={handleRun}
                                disabled={isLoading || !toolUrl}
                                style={{
                                    background: isLoading || !toolUrl ? "rgba(255,255,255,0.03)" : "var(--accent)",
                                    color: isLoading || !toolUrl ? "var(--muted)" : "#000",
                                    border: "none", borderRadius: 12, width: 48, height: 48,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: isLoading || !toolUrl ? "not-allowed" : "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: !isLoading && toolUrl ? "0 8px 16px -4px rgba(202,138,4,0.3)" : "none"
                                }}
                            >
                                <Play size={20} fill={!isLoading && toolUrl ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>

                    <div style={{
                        flex: 1, background: "rgba(0,0,0,0.3)", borderRadius: 16, padding: 20,
                        overflowY: "auto", fontSize: 13, color: "var(--muted)", lineHeight: 1.8,
                        fontFamily: "var(--font-mono)", border: "1px solid rgba(255,255,255,0.03)"
                    }}>
                        {logs.map((log, i) => (
                            <div key={i} style={{
                                marginBottom: 4,
                                color: log.startsWith("[SYSTEM]") ? "var(--muted)" :
                                    log.startsWith("[EXEC]") ? "var(--accent)" :
                                        log.startsWith("[COMPLETE]") ? "#34D399" :
                                            log.startsWith("[FAIL]") ? "#EF4444" : "var(--muted)"
                            }}>
                                <span style={{ opacity: 0.3, marginRight: 8 }}>{i + 1}</span>
                                {log}
                            </div>
                        ))}
                        {logs.length === 0 && <span style={{ opacity: 0.2 }}>System in homeostasis. Awaiting command input...</span>}
                    </div>
                </div>

                {/* Preview Area */}
                <div style={{ flex: 1, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
                        <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(28,25,23,0.8)", border: "1px solid var(--border)", fontSize: 10, fontWeight: 900, color: "var(--muted)", backdropFilter: "blur(10px)" }}>
                            LIVE_VIEWPORT
                        </div>
                    </div>

                    {screenshot ? (
                        <div style={{ width: "100%", height: "100%", padding: 32 }}>
                            <img src={screenshot} alt="Agent Result" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }} />
                        </div>
                    ) : (
                        <div style={{ color: "rgba(255,255,255,0.05)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                            <Monitor size={80} strokeWidth={1} />
                            <div style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", fontSize: 11 }}>Awaiting Protocol Output</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
