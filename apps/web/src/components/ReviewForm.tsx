"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions";
import { Star, CheckCircle, AlertCircle, MessageSquare, Send } from "lucide-react";

export default function ReviewForm({ toolId }: { toolId: string }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("submitting");
        try {
            const formData = new FormData();
            formData.append("toolId", toolId);
            formData.append("rating", rating.toString());
            formData.append("content", content);

            const result = await submitReview(formData);
            if (result?.error) {
                setStatus("error");
                setErrorMsg(result.error);
            } else {
                setStatus("success");
            }
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || "An error occurred");
        }
    }

    if (status === "success") {
        return (
            <div style={{ padding: 40, background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 24, textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#10B981" }}>
                    <CheckCircle size={32} />
                </div>
                <div style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", fontFamily: "var(--font-display)" }}>Review Submitted</div>
                <div style={{ color: "var(--muted)", fontSize: 16, marginTop: 8, fontWeight: 500, fontFamily: "var(--font-sans)" }}>Your contribution helps the AI Nexus community thrive.</div>
            </div>
        );
    }

    return (
        <div style={{ padding: 40, background: "var(--background)", border: "1px solid var(--border)", borderRadius: 24, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(79,70,229,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--foreground)", margin: 0, letterSpacing: "-0.5px", fontFamily: "var(--font-display)" }}>Share Your Experience</h3>
                    <p style={{ margin: "4px 0 0", fontSize: 15, color: "var(--muted)", fontWeight: 500, fontFamily: "var(--font-sans)" }}>Help others discover the full potential of this tool.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 12, fontFamily: "var(--font-sans)" }}>Rating</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 4,
                                    color: star <= (hoverRating || rating) ? "var(--accent)" : "var(--border)",
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transform: star <= (hoverRating || rating) ? "scale(1.1)" : "scale(1)"
                                }}
                            >
                                <Star
                                    size={32}
                                    fill={star <= (hoverRating || rating) ? "var(--accent)" : "none"}
                                    strokeWidth={star <= (hoverRating || rating) ? 0 : 2}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 12, fontFamily: "var(--font-sans)" }}>Detailed Analysis</label>
                    <div style={{ position: "relative" }}>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                            rows={5}
                            placeholder="What were your findings? Any specific use cases or limitations..."
                            style={{
                                width: "100%",
                                padding: "20px",
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                borderRadius: 16,
                                color: "var(--foreground)",
                                fontFamily: "var(--font-sans)",
                                fontSize: 16,
                                lineHeight: 1.6,
                                resize: "vertical",
                                outline: "none",
                                transition: "all 0.2s ease",
                                boxSizing: "border-box",
                                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "var(--accent)";
                                e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "var(--border)";
                                e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.02)";
                            }}
                        />
                    </div>
                </div>

                {status === "error" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#EF4444", fontSize: 14, background: "rgba(239,68,68,0.08)", padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)" }}>
                        <AlertCircle size={18} />
                        <span style={{ fontWeight: 600 }}>{errorMsg}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "submitting" || !content.trim()}
                    style={{
                        padding: "16px 32px",
                        background: status === "submitting" ? "var(--border)" : "var(--accent)",
                        color: status === "submitting" ? "var(--muted)" : "#FFF",
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: status === "submitting" ? "not-allowed" : "pointer",
                        alignSelf: "flex-start",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "var(--font-sans)",
                        boxShadow: status === "submitting" ? "none" : "0 4px 14px 0 var(--accent-glow)",
                    }}
                    onMouseEnter={e => {
                        if (status !== "submitting") {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px 0 var(--accent-glow)";
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = status === "submitting" ? "none" : "0 4px 14px 0 var(--accent-glow)";
                    }}
                >
                    {status === "submitting" ? (
                        <>Submitting...</>
                    ) : (
                        <>
                            Publish Review
                            <Send size={18} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
