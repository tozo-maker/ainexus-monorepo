import React from "react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SharedNavbar from "@/components/SharedNavbar";
import { Bell, Mail, ShieldAlert, Cpu } from "lucide-react";

export default async function AlertsPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // ignore server side set cookie error
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user preferences
    const { data: preferences } = await supabase
        .from('users')
        .select('email_digest, email_alerts')
        .eq('id', user.id)
        .single();

    const styles = {
        page: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column" as const,
            background: "var(--background)",
            fontFamily: "var(--font-sans)"
        },
        container: {
            flex: 1,
            padding: "48px 24px",
            maxWidth: 800,
            margin: "0 auto",
            width: "100%"
        },
        header: {
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 8,
            color: "var(--foreground)",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em"
        },
        subtitle: {
            fontSize: 16,
            color: "var(--muted)",
            marginBottom: 40
        },
        card: {
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 32,
            marginBottom: 24,
            boxShadow: "var(--shadow-sm)"
        },
        settingRow: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            paddingBottom: 24,
            borderBottom: "1px solid var(--border)",
            marginBottom: 24
        },
        settingTitle: {
            fontSize: 16,
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 8
        },
        settingDesc: {
            fontSize: 14,
            color: "var(--muted)",
            maxWidth: 480,
            lineHeight: 1.5
        },
        toggleBtn: {
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s"
        },
        activeBtn: {
            background: "var(--accent)",
            color: "#FFF",
        },
        inactiveBtn: {
            background: "var(--secondary)",
            color: "var(--muted)",
        }
    };

    return (
        <div style={styles.page}>
            <SharedNavbar activeNav="discover" user={user} />

            <main style={styles.container}>
                <h1 style={styles.header}>Alerts & Preferences</h1>
                <p style={styles.subtitle}>Manage your email digests, pricing alerts, and personalized AI recommendations.</p>

                <div style={styles.card}>
                    <div style={styles.settingRow}>
                        <div>
                            <div style={styles.settingTitle}><Mail size={18} className="text-[var(--accent)]" /> Daily AI Digest</div>
                            <div style={styles.settingDesc}>Get a daily summary of the hottest AI tools, news, and generative model updates right in your inbox.</div>
                        </div>
                        <button style={{ ...styles.toggleBtn, ...(preferences?.email_digest !== false ? styles.activeBtn : styles.inactiveBtn) }}>
                            {preferences?.email_digest !== false ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>

                    <div style={styles.settingRow}>
                        <div>
                            <div style={styles.settingTitle}><ShieldAlert size={18} className="text-[var(--accent)]" /> Pricing Change Alerts</div>
                            <div style={styles.settingDesc}>We actively monitor the pricing pages for all your saved tools. We'll automatically notify you if a price hikes or a free tier is degraded.</div>
                        </div>
                        <button style={{ ...styles.toggleBtn, ...(preferences?.email_alerts !== false ? styles.activeBtn : styles.inactiveBtn) }}>
                            {preferences?.email_alerts !== false ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>

                    <div style={{ ...styles.settingRow, borderBottom: "none", paddingBottom: 0, marginBottom: 0 }}>
                        <div>
                            <div style={styles.settingTitle}><Cpu size={18} className="text-[var(--accent)]" /> New Model Tracking (Beta)</div>
                            <div style={styles.settingDesc}>Receive specialized alerts when foundational LLMs (e.g. GPT, Claude) make major version updates or price cuts.</div>
                        </div>
                        <button style={{ ...styles.toggleBtn, ...styles.inactiveBtn }}>
                            Coming Soon
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 32 }}>
                    Don't worry, we guarantee 1-click unsubscribe and absolutely zero spam.
                </p>
            </main>
        </div>
    );
}
