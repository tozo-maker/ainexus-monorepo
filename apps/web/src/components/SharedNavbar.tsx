"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    Search,
    Globe,
    Cpu,
    Newspaper,
    Video,
    Repeat,
    Star,
    ArrowRight,
    Activity,
    LogOut,
    Zap,
    ExternalLink,
    ChevronRight,
    Play,
    Mail,
    Smartphone,
    Monitor,
    ShieldCheck,
    Diamond,
    LayoutGrid,
    TrendingUp,
    BarChart3,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';

export default function SharedNavbar({
    user,
    compareListCount = 0
}: {
    user?: any;
    compareListCount?: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [spatialMode, setSpatialMode] = useState(false);

    const navItems = [
        { id: "discover", label: "Discover", icon: <Globe size={14} />, href: "/" },
        { id: "models", label: "Intelligence", icon: <Cpu size={14} />, href: "/platforms" },
        { id: "news", label: "Newsroom", icon: <Newspaper size={14} />, href: "/news" },
        { id: "videos", label: "Studio", icon: <Video size={14} />, href: "/videos" },
        { id: "compare", label: "Compare", icon: <Repeat size={14} />, href: "/compare" },
    ];

    const styles = {
        nav: {
            position: "sticky" as const,
            top: 0,
            zIndex: 100,
            background: "var(--background)",
            borderBottom: "1px solid var(--border)",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            height: 64,
            maxWidth: 1920,
            width: "100%",
            margin: "0 auto"
        },
        logo: {
            fontSize: 20,
            fontWeight: 800,
            color: "var(--foreground)",
            marginRight: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            textDecoration: "none",
            background: "none",
            border: "none"
        },
        logoAccent: { color: "var(--accent)" },
        navItem: (active: boolean) => ({
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: active ? "var(--foreground)" : "var(--muted)",
            background: active ? "rgba(79,70,229,0.05)" : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s",
            border: "none",
        }),
        navRight: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 },
        navBtn: {
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "var(--transition)",
            border: "1px solid var(--border)",
            background: "var(--background)",
            color: "var(--foreground)",
            boxShadow: "var(--shadow-sm)",
            textDecoration: "none"
        },
        navBtnPrimary: {
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "var(--transition)",
            border: "none",
            background: "var(--accent)",
            color: "#FFF",
            boxShadow: "0 4px 6px -1px var(--accent-glow)",
            textDecoration: "none"
        }
    };



    return (
        <nav style={styles.nav}>
            <Link href="/" style={{ ...styles.logo }}>
                <Diamond size={24} fill="var(--accent)" stroke="var(--accent)" />
                <span>AI<span style={styles.logoAccent}>Nexus</span></span>
            </Link>
            {navItems.map(item => (
                <Link
                    key={item.id}
                    href={item.href}
                    style={styles.navItem(pathname === item.href)}
                >
                    {item.icon}
                    {item.label}
                    {item.id === "compare" && compareListCount > 0 && (
                        <span style={{
                            marginLeft: 6,
                            background: "var(--accent)",
                            color: "#FFF",
                            borderRadius: "50%",
                            width: 16,
                            height: 16,
                            fontSize: 10,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800
                        }}>
                            {compareListCount}
                        </span>
                    )}
                </Link>
            ))}
            <div style={styles.navRight}>
                {user ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{user.email}</div>
                        <form action="/auth/signout" method="post" style={{ margin: 0 }}>
                            <button type="submit" style={{ ...styles.navBtn, display: "flex", alignItems: "center", gap: 8 }}>
                                <LogOut size={14} />
                                <span>Sign Out</span>
                            </button>
                        </form>
                        <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFF",
                            fontWeight: 800,
                            fontSize: 14
                        }}>
                            {user.email?.[0].toUpperCase()}
                        </div>
                    </div>
                ) : (
                    <>
                        <button onClick={() => router.push("/login")} style={styles.navBtn}>Sign In</button>
                        <button onClick={() => router.push("/login")} style={{ ...styles.navBtnPrimary, marginLeft: 8 }}>Get Started Free</button>
                    </>
                )}

                {/* Spatial Toggle */}
                <button
                    onClick={() => setSpatialMode(!spatialMode)}
                    style={{
                        ...styles.navBtn,
                        marginLeft: 12,
                        background: "rgba(167,139,250,0.05)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        color: "#A78BFA",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    <Globe size={14} /> <span>3D Intelligence</span>
                </button>
            </div>
        </nav>
    );
}
