import React from "react";
import SharedNavbar from "@/components/SharedNavbar";
import { ShieldCheck, Activity, Globe, Scale, BookOpen, Clock, AlertTriangle } from "lucide-react";

export default function MethodologyPage() {
    const styles = {
        page: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
            background: "var(--background)",
            fontFamily: "var(--font-sans)",
            color: "var(--foreground)"
        },
        container: {
            flex: 1,
            padding: "64px 24px",
            maxWidth: 900,
            margin: "0 auto",
            width: "100%"
        },
        header: {
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 16,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.03em",
            textAlign: "center" as const
        },
        subtitle: {
            fontSize: 18,
            color: "var(--muted)",
            marginBottom: 64,
            textAlign: "center" as const,
            maxWidth: 600,
            lineHeight: 1.6,
            margin: "0 auto 64px auto"
        },
        section: {
            marginBottom: 64
        },
        sectionTitle: {
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid var(--border)",
            paddingBottom: 16
        },
        cardGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24
        },
        riskCard: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "var(--shadow-sm)"
        },
        calloutBox: {
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: 12,
            padding: 24,
            marginTop: 32,
            display: "flex",
            gap: 16,
            alignItems: "flex-start"
        },
        table: {
            width: "100%",
            borderCollapse: "collapse" as const,
            marginTop: 16,
            background: "rgba(255,255,255,0.01)",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--border)"
        },
        th: {
            textAlign: "left" as const,
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(255,255,255,0.03)",
            fontWeight: 600,
            color: "var(--foreground)"
        },
        td: {
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
            color: "var(--muted)"
        },
        strong: {
            color: "var(--foreground)",
            fontWeight: 600
        },
        list: {
            listStyle: "none",
            padding: 0,
            margin: 0
        },
        listItem: {
            padding: "12px 0",
            borderBottom: "1px dashed var(--border)",
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            gap: 12
        }
    };

    return (
        <div style={styles.page}>
            <SharedNavbar activeNav="" />

            <main style={styles.container}>
                <h1 style={styles.header}>How We Score AI Tools</h1>
                <div style={styles.subtitle}>
                    <p style={{ marginBottom: 16, color: "var(--foreground)", fontWeight: 500 }}>Every score on AINexus is derived from a documented, repeatable methodology. This page exists so that:</p>
                    <ul style={{ ...styles.list, textAlign: "left", display: "inline-block", marginBottom: 24 }}>
                        <li style={{ padding: "4px 0" }}>• Developers can understand exactly what a score means before relying on it</li>
                        <li style={{ padding: "4px 0" }}>• Tool makers can know what to improve to raise their grade</li>
                        <li style={{ padding: "4px 0" }}>• Journalists and compliance teams can cite our methodology</li>
                        <li style={{ padding: "4px 0" }}>• We can defend every score if challenged</li>
                    </ul>
                    <div style={{ background: "rgba(245,158,11,0.05)", padding: 16, borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)", fontSize: 13, textAlign: "left" }}>
                        <strong style={{ color: "#F59E0B" }}>Important disclaimer:</strong> AINexus scores are based on publicly available information and our own analysis. They are for informational purposes only and do not constitute legal advice. For formal compliance assessments, consult a qualified legal or compliance professional.
                    </div>
                </div>

                {/* The Four Dimensions */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><Activity style={{ color: "var(--accent)" }} /> The Four Dimensions</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
                            <div><strong style={styles.strong}>EU AI Act Risk Tier</strong> — Minimal / Limited / High / Unacceptable / Unclassified</div>
                        </li>
                        <li style={styles.listItem}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
                            <div><strong style={styles.strong}>Compliance Score</strong> — 0 to 100, based on 5 weighted criteria</div>
                        </li>
                        <li style={styles.listItem}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
                            <div><strong style={styles.strong}>Data Governance Grade</strong> — A to F (or N/A for self-hosted tools)</div>
                        </li>
                        <li style={styles.listItem}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>4</div>
                            <div><strong style={styles.strong}>Transparency Index</strong> — 0 to 100, based on 7 openness criteria</div>
                        </li>
                    </ul>
                </section>

                {/* EU AI Act Risk Tiers */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><Scale style={{ color: "var(--accent)" }} /> EU AI Act Risk Tiers</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={styles.riskCard}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, marginBottom: 12, color: "#10B981" }}>🟢 Minimal Risk</h3>
                            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>Tools that present little to no risk to fundamental rights or safety. The vast majority of AI tools fall here.</p>
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                <strong style={styles.strong}>Apply this tier when ALL of the following are true:</strong>
                                <ul style={{ marginLeft: 20, marginTop: 4, lineHeight: 1.6 }}>
                                    <li>The tool is a general-purpose AI assistant, generator, or productivity tool</li>
                                    <li>It is not specifically designed or marketed for any of the Annex III high-risk use cases</li>
                                    <li>It does not make consequential autonomous decisions about people's lives</li>
                                    <li>It is not used in safety-critical infrastructure</li>
                                </ul>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--muted)" }}><strong style={styles.strong}>Examples:</strong> ChatGPT, Claude, Midjourney, Ollama, Notion AI</div>
                        </div>

                        <div style={styles.riskCard}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, marginBottom: 12, color: "#F59E0B" }}>🟡 Limited Risk</h3>
                            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>Tools subject to specific transparency obligations. Primarily tools that interact directly with end users in ways that could cause confusion about whether they are talking to a human.</p>
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                <strong style={styles.strong}>Apply this tier when ANY of the following are true:</strong>
                                <ul style={{ marginLeft: 20, marginTop: 4, lineHeight: 1.6 }}>
                                    <li>The tool is a chatbot or conversational agent deployed to interact with the public</li>
                                    <li>The tool generates synthetic media intended to be mistaken for real content</li>
                                    <li>The tool is used in emotion recognition or biometric categorisation in non-prohibited contexts</li>
                                </ul>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--muted)" }}><strong style={styles.strong}>Examples:</strong> Customer-facing chatbots, AI avatars, deepfake detection</div>
                        </div>

                        <div style={styles.riskCard}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, marginBottom: 12, color: "#F97316" }}>🔴 High Risk</h3>
                            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>AI systems listed in Annex III of the EU AI Act. Requires conformity assessments, technical documentation, human oversight, and registration.</p>
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                <strong style={styles.strong}>Apply this tier when the tool is specifically designed for ANY Annex III use cases:</strong>
                                <ul style={{ marginLeft: 20, marginTop: 4, lineHeight: 1.6 }}>
                                    <li>Biometric identification / categorisation</li>
                                    <li>Critical infrastructure management</li>
                                    <li>Educational or vocational training access</li>
                                    <li>Employment and worker management (CV screening)</li>
                                    <li>Access to essential private/public services (credit, insurance)</li>
                                    <li>Law enforcement, migration mapping, administration of justice</li>
                                </ul>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--muted)" }}><strong style={styles.strong}>Examples:</strong> HireVue, Schufa, predictive policing</div>
                        </div>

                        <div style={styles.riskCard}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, marginBottom: 12, color: "#EF4444" }}>🚫 Unacceptable Risk (Prohibited)</h3>
                            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>AI practices explicitly prohibited under Article 5 of the EU AI Act. Cannot be legally deployed in the EU.</p>
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                                <strong style={styles.strong}>Apply this tier ONLY if the tool is designed for:</strong>
                                <ul style={{ marginLeft: 20, marginTop: 4, lineHeight: 1.6 }}>
                                    <li>Social scoring by public authorities</li>
                                    <li>Real-time remote biometric ID in public spaces</li>
                                    <li>Subliminal manipulation techniques</li>
                                    <li>Untargeted facial image scraping</li>
                                </ul>
                            </div>
                        </div>

                        <div style={styles.riskCard}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, marginBottom: 12, color: "var(--border)" }}>🔘 Unclassified</h3>
                            <p style={{ color: "var(--muted)", fontSize: 14 }}>Insufficient public information to make a determination, or the use case is genuinely ambiguous.</p>
                        </div>

                        <div style={{ background: "rgba(0,0,0,0.2)", padding: 24, borderRadius: 12, border: "1px solid var(--border)", fontFamily: "monospace", fontSize: 13, color: "var(--muted)", overflowX: "auto", whiteSpace: "pre" }}>
                            {`START: What does this tool primarily do?
│
├─ Is it on the Article 5 prohibited list?
│   YES → UNACCEPTABLE RISK
│   NO  ↓
│
├─ Is it designed for an Annex III use case?
│   YES → HIGH RISK
│   NO  ↓
│
├─ Is it a public-facing chatbot OR generates synthetic media?
│   YES → LIMITED RISK
│   NO  ↓
│
└─ MINIMAL RISK`}
                        </div>
                    </div>

                    <div style={styles.calloutBox}>
                        <AlertTriangle style={{ color: "#10B981", flexShrink: 0 }} size={24} />
                        <div>
                            <strong style={{ display: "block", color: "#10B981", marginBottom: 8 }}>Important Limitation Context</strong>
                            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                                Risk tier follows the tool's design and intended use — not how a customer deploys it.
                                A general-purpose LLM used for medical research is still Minimal Risk. The clinical application
                                built on top of it is a separate High Risk system.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Compliance Score */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><ShieldCheck style={{ color: "var(--accent)" }} /> Compliance Score (0–100)</h2>
                    <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                        How well the tool maker has documented, disclosed, and implemented responsible AI practices.
                        This is about the <i style={{ color: "var(--foreground)" }}>quality of their compliance posture</i>, not just the risk tier.
                        Consists of 5 components, 20 points each.
                    </p>

                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--foreground)" }}>A. Transparency & Documentation (0–20)</h3>
                    <table style={{ ...styles.table, marginBottom: 32 }}>
                        <thead><tr><th style={{ ...styles.th, width: 90 }}>Points</th><th style={styles.th}>Evidence</th></tr></thead>
                        <tbody>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>18–20</td><td style={styles.td}>Model card published. Training data disclosed. Architecture documented. Third-party evals.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>13–17</td><td style={styles.td}>Partial model documentation. Some training data disclosure.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>8–12</td><td style={styles.td}>Basic product documentation only. No model-level transparency.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>0–7</td><td style={styles.td}>Minimal documentation to Black box.</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--foreground)" }}>B. Data Governance Disclosure (0–20)</h3>
                    <table style={{ ...styles.table, marginBottom: 32 }}>
                        <thead><tr><th style={{ ...styles.th, width: 90 }}>Points</th><th style={styles.th}>Evidence</th></tr></thead>
                        <tbody>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>18–20</td><td style={styles.td}>Privacy policy explicitly states: retention period, training use, opt-out, third-party sharing, DPA contact.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>13–17</td><td style={styles.td}>Most of the above present. Opt-out available but not prominent.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>8–12</td><td style={styles.td}>Basic privacy policy. Little detail on retention or training.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>0–7</td><td style={styles.td}>Vague to nonexistent privacy policy.</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--foreground)" }}>C. GDPR / Regulatory Alignment (0–20)</h3>
                    <table style={{ ...styles.table, marginBottom: 32 }}>
                        <thead><tr><th style={{ ...styles.th, width: 90 }}>Points</th><th style={styles.th}>Evidence</th></tr></thead>
                        <tbody>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>18–20</td><td style={styles.td}>GDPR DPA available. EU data residency option. Formal compliance (SOC2/ISO). EU AI Act statement.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>13–17</td><td style={styles.td}>DPA available. Some EU-specific features. No formal certifications.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>8–12</td><td style={styles.td}>Claims GDPR compliance without substantial evidence. Basic DPA template.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>0–7</td><td style={styles.td}>Minimal acknowledgement to active violations.</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--foreground)" }}>D. Safety & Misuse Prevention (0–20)</h3>
                    <table style={{ ...styles.table, marginBottom: 32 }}>
                        <thead><tr><th style={{ ...styles.th, width: 90 }}>Points</th><th style={styles.th}>Evidence</th></tr></thead>
                        <tbody>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>18–20</td><td style={styles.td}>Published safety policy. Red-teaming results. Abuse reporting. Content policies. Regular updates.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>13–17</td><td style={styles.td}>Clear usage policies. Basic abuse reporting. Some safety docs.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>8–12</td><td style={styles.td}>Generic ToS prohibitions. No dedicated safety page.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>0–7</td><td style={styles.td}>Minimal restrictions to intentionally designed circumventions.</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--foreground)" }}>E. Accountability & Contact (0–20)</h3>
                    <table style={{ ...styles.table, marginBottom: 32 }}>
                        <thead><tr><th style={{ ...styles.th, width: 90 }}>Points</th><th style={styles.th}>Evidence</th></tr></thead>
                        <tbody>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>18–20</td><td style={styles.td}>Named AI ethics/compliance contact. Public incident response history. EU representative named.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>13–17</td><td style={styles.td}>Clear contact for data issues. Some accountability mechanisms.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>8–12</td><td style={styles.td}>General support contact only.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)" }}>0–7</td><td style={styles.td}>No clear contact to completely unreachable.</td></tr>
                        </tbody>
                    </table>
                </section>

                {/* Data Governance Grade */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><Globe style={{ color: "var(--accent)" }} /> Data Governance Grade</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Grade</th>
                                <th style={styles.th}>Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style={{ ...styles.td, color: "#10B981", fontWeight: 800 }}>A</td><td style={styles.td}>Does not train on your data by default. Explicit retention limits. Data deletion available.</td></tr>
                            <tr><td style={{ ...styles.td, color: "#34D399", fontWeight: 800 }}>B</td><td style={styles.td}>Does not train by default OR has a clear opt-out. Retention policy stated.</td></tr>
                            <tr><td style={{ ...styles.td, color: "#FBBF24", fontWeight: 800 }}>C</td><td style={styles.td}>May train on your data. Opt-out exists but not default or hard to find.</td></tr>
                            <tr><td style={{ ...styles.td, color: "#F87171", fontWeight: 800 }}>D</td><td style={styles.td}>Trains on your data with no easy opt-out. Unclear retention.</td></tr>
                            <tr><td style={{ ...styles.td, color: "#EF4444", fontWeight: 800 }}>F</td><td style={styles.td}>Trains on your data, no opt-out, no deletion. Active violations or breaches.</td></tr>
                            <tr><td style={{ ...styles.td, color: "var(--foreground)", fontWeight: 800 }}>N/A</td><td style={styles.td}>Self-hosted or open-source. You control all data. The best possible outcome.</td></tr>
                        </tbody>
                    </table>
                </section>

                {/* Transparency Index */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}><BookOpen style={{ color: "var(--accent)" }} /> Transparency Index (0–100)</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Criterion</th>
                                <th style={styles.th}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style={styles.td}><strong style={styles.strong}>Model card published</strong></td><td style={styles.td}>25</td></tr>
                            <tr><td style={styles.td}><strong style={styles.strong}>Open weights / open source</strong></td><td style={styles.td}>20</td></tr>
                            <tr><td style={styles.td}><strong style={styles.strong}>Training data disclosed</strong></td><td style={styles.td}>15</td></tr>
                            <tr><td style={styles.td}><strong style={styles.strong}>Third-party evaluations</strong></td><td style={styles.td}>15</td></tr>
                            <tr><td style={styles.td}><strong style={styles.strong}>Benchmarks published</strong></td><td style={styles.td}>10</td></tr>
                            <tr><td style={styles.td}><strong style={styles.strong}>Audit history</strong></td><td style={styles.td}>10</td></tr>
                            <tr><td style={styles.td}><strong style={styles.strong}>Known limitations stated</strong></td><td style={styles.td}>5</td></tr>
                        </tbody>
                    </table>
                </section>

                {/* Scoring Worked Examples */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Scoring Worked Examples</h2>

                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "var(--foreground)" }}>Example 1: Ollama</h3>
                    <table style={{ ...styles.table, marginBottom: 48 }}>
                        <thead>
                            <tr><th style={{ ...styles.th, width: 140 }}>Dimension</th><th style={{ ...styles.th, width: 120 }}>Score</th><th style={styles.th}>Rationale</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>EU AI Act Tier</strong></td>
                                <td style={styles.td}>Minimal Risk</td>
                                <td style={styles.td}>General-purpose local LLM runner. No Annex III use case. User controls all execution.</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>Compliance Score</strong></td>
                                <td style={styles.td}>94/100</td>
                                <td style={styles.td}>A: 18 (full GitHub docs), B: 20 (no data config — local), C: 18 (open-source governance), D: 20 (no platform misuse vector), E: 18 (active community)</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>Data Governance</strong></td>
                                <td style={styles.td}>N/A</td>
                                <td style={styles.td}>Fully self-hosted. Zero centralised data collection. User owns all data.</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>Transparency Index</strong></td>
                                <td style={styles.td}>98/100</td>
                                <td style={styles.td}>Open weights (20), open source (20), active model card ecosystem, third-party evaluations, known limitations documented.</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "var(--foreground)" }}>Example 2: A Hiring AI Tool (Hypothetical)</h3>
                    <table style={{ ...styles.table, marginBottom: 32 }}>
                        <thead>
                            <tr><th style={{ ...styles.th, width: 140 }}>Dimension</th><th style={{ ...styles.th, width: 120 }}>Score</th><th style={styles.th}>Rationale</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>EU AI Act Tier</strong></td>
                                <td style={styles.td}>High Risk</td>
                                <td style={styles.td}>Annex III Category 4. Specifically designed to screen CVs and rank candidates.</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>Compliance Score</strong></td>
                                <td style={styles.td}>35/100</td>
                                <td style={styles.td}>A: 5 (no model docs), B: 8 (basic privacy policy), C: 6 (claims GDPR, no DPA), D: 10 (usage policy exists), E: 6 (support email only)</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>Data Governance</strong></td>
                                <td style={styles.td}>D</td>
                                <td style={styles.td}>Trains on aggregated hiring data. Opt-out not clearly available. Candidate data retained for 3 years.</td>
                            </tr>
                            <tr>
                                <td style={styles.td}><strong style={styles.strong}>Transparency Index</strong></td>
                                <td style={styles.td}>28/100</td>
                                <td style={styles.td}>No model card, no open weights, no published evaluations, basic benchmark claims only.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* Our Sources */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Our Sources</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>1. Tool's own official documentation (privacy policy, ToS, model cards, trust portals)</li>
                        <li style={styles.listItem}>2. EU official sources (artificialintelligenceact.eu, national DPA decisions, EU AI Office)</li>
                        <li style={styles.listItem}>3. Independent bodies (ToS;DR, IAPP enforcement tracker, Common Sense Privacy)</li>
                        <li style={styles.listItem}>4. Credible investigative journalism</li>
                        <li style={styles.listItem}>5. Academic and security research</li>
                    </ul>
                </section>

                {/* Review Policy & Disclaimer */}
                <section style={{ ...styles.cardGrid, gridTemplateColumns: "1fr 1fr" }}>
                    <div style={{ ...styles.riskCard, background: "rgba(255,255,255,0)" }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, marginBottom: 12 }}><Clock size={16} /> Review Policy</h3>
                        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                            Scores are reviewed every 90 days as standard. Reviews are triggered immediately
                            by a material privacy policy change, data breach, DPA enforcement action, or
                            significant product change. Tool makers can request a review at compliance@ainexus.io.
                            All score changes are logged with a date and rationale.
                        </p>
                    </div>
                    <div style={{ ...styles.riskCard, background: "rgba(255,255,255,0)" }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, marginBottom: 12 }}>Disclaimer</h3>
                        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                            AILexus scores are based on publicly available information and independent analysis.
                            They are for informational purposes only and do not constitute legal advice.
                            For formal compliance assessments, consult a qualified legal or compliance professional.
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
}
