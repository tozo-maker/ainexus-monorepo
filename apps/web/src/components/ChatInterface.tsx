"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User as UserIcon, Zap } from "lucide-react";

export default function ChatInterface() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([
        { role: "ai", text: "Welcome to AI Nexus. I am your intelligence curator. How can I assist your research today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "ai", text: "System error. Neural link interrupted." }]);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: "ai", text: "Network latency exceeded. Connection failed." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: 380, height: 560, background: "rgba(12,10,9,0.95)",
                    border: "1px solid var(--border)", borderRadius: 24,
                    boxShadow: "0 24px 64px -16px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column",
                    marginBottom: 20, overflow: "hidden", backdropFilter: "blur(20px)"
                }}>
                    {/* Header */}
                    <div style={{ padding: "20px 24px", background: "rgba(28,25,23,0.4)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(202,138,4,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                                <Bot size={18} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 900, color: "#FFF", fontSize: 15, letterSpacing: "-0.3px" }}>Nexus Intelligence</div>
                                <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Active Terminal</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={14} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                                display: "flex",
                                flexDirection: m.role === "user" ? "row-reverse" : "row",
                                gap: 12,
                                maxWidth: "90%"
                            }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                    background: m.role === "user" ? "rgba(255,255,255,0.05)" : "rgba(202,138,4,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: m.role === "user" ? "var(--muted)" : "var(--accent)",
                                    marginTop: 4
                                }}>
                                    {m.role === "user" ? <UserIcon size={14} /> : <Bot size={14} />}
                                </div>
                                <div style={{
                                    background: m.role === "user" ? "var(--accent)" : "rgba(28,25,23,0.8)",
                                    color: m.role === "user" ? "#000" : "#E5E7EB",
                                    padding: "12px 16px", borderRadius: 16,
                                    fontSize: 14, fontWeight: m.role === "user" ? 700 : 500, lineHeight: 1.6,
                                    border: m.role === "user" ? "none" : "1px solid var(--border)",
                                    borderTopRightRadius: m.role === "user" ? 4 : 16,
                                    borderTopLeftRadius: m.role === "ai" ? 4 : 16,
                                    boxShadow: m.role === "user" ? "0 8px 24px -8px rgba(202,138,4,0.4)" : "none"
                                }}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: "flex-start", display: "flex", gap: 12, alignItems: "center" }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(202,138,4,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                                    <Bot size={14} />
                                </div>
                                <div style={{ background: "rgba(28,25,23,0.4)", padding: "12px 16px", borderRadius: 16, fontSize: 12, color: "var(--muted)", fontStyle: "italic", border: "1px solid var(--border)" }}>
                                    Analyzing directory...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={{ padding: 20, borderTop: "1px solid var(--border)", background: "rgba(28,25,23,0.4)" }}>
                        <div style={{ display: "flex", gap: 10, background: "rgba(12,10,9,0.4)", border: "1px solid var(--border)", borderRadius: 12, padding: "4px 4px 4px 14px", alignItems: "center" }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                placeholder="Consult the Nexus..."
                                style={{
                                    flex: 1, background: "none", border: "none",
                                    color: "white", fontSize: 14, outline: "none", fontWeight: 500
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                style={{
                                    background: input.trim() ? "var(--accent)" : "rgba(255,255,255,0.03)",
                                    color: input.trim() ? "#000" : "var(--muted)",
                                    border: "none", borderRadius: 8, width: 36, height: 36,
                                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: 64, height: 64, borderRadius: 20, background: "var(--accent)",
                        color: "#000", border: "none", cursor: "pointer",
                        boxShadow: "0 16px 32px -8px rgba(202,138,4,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = "scale(1.05) translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 24px 48px -12px rgba(202,138,4,0.5)";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(202,138,4,0.4)";
                    }}
                >
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
}
