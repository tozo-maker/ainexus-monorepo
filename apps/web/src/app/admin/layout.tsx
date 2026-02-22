import React from "react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Database, Settings, ExternalLink } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                        // Handled in middleware
                    }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser();

    // Check if user exists. Hardcoding an admin check here by email for the MVP MVP.
    // In production, use an `admin` role in JWT or `users` table.
    const isAdmin = user && (user.email === 'alexander@antygravity.com' || user.email === 'admin@ainexus.com');

    if (!isAdmin) {
        redirect('/');
    }

    const styles = {
        container: { display: "flex", minHeight: "100vh", background: "var(--background)" },
        sidebar: {
            width: 250,
            background: "rgba(255,255,255,0.01)",
            borderRight: "1px solid var(--border)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column" as const,
            gap: 8
        },
        logo: {
            fontSize: 20,
            fontWeight: 800,
            color: "var(--foreground)",
            marginBottom: 32,
            padding: "0 16px",
            fontFamily: "var(--font-display)"
        },
        navItem: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 8,
            color: "var(--muted)",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s"
        },
        main: { flex: 1, padding: 32, overflowY: "auto" as const }
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>AINexus <span style={{ color: "var(--accent)" }}>Admin</span></div>

                <Link href="/admin" style={styles.navItem} className="hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)]">
                    <LayoutDashboard size={18} /> Overview
                </Link>
                <Link href="/admin/tools" style={styles.navItem} className="hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)]">
                    <Database size={18} /> Tools Database
                </Link>
                <Link href="/admin/users" style={styles.navItem} className="hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)]">
                    <Users size={18} /> Users
                </Link>
                <Link href="/admin/settings" style={styles.navItem} className="hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)]">
                    <Settings size={18} /> Settings
                </Link>

                <div style={{ marginTop: "auto" }}>
                    <Link href="/" style={{ ...styles.navItem, marginTop: "auto" }} className="hover:text-[var(--foreground)]">
                        <ExternalLink size={18} /> Back to App
                    </Link>
                </div>
            </aside>
            <main style={styles.main}>
                {children}
            </main>
        </div>
    );
}
