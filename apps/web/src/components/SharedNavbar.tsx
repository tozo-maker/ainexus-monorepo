"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    activeNav = "discover",
    setActiveNav,
    user,
    compareListCount = 0
}: {
    activeNav?: string;
    setActiveNav?: (tab: string) => void;
    user?: any;
    compareListCount?: number;
}) {
    const router = useRouter();
    const [spatialMode, setSpatialMode] = useState(false);

    const navItems = [
        { id: "discover", label: "Discover", icon: <Search size={14} /> },
        { id: "categories", label: "Categories", icon: <LayoutGrid size={14} /> },
        { id: "compare", label: "Compare", icon: <Repeat size={14} /> },
        { id: "models", label: "Models", icon: <Cpu size={14} /> },
        { id: "news", label: "News", icon: <Newspaper size={14} /> },
        { id: "videos", label: "Videos", icon: <Video size={14} /> },
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

    const handleNavClick = (id: string) => {
        if (setActiveNav) {
            setActiveNav(id);
        } else {
            router.push("/");
        }
    };

    return (
        <nav style={styles.nav}>
            <button style={{ ...styles.logo, outline: "none" }} onClick={() => handleNavClick("discover")}>
                <Diamond size={24} fill="var(--accent)" stroke="var(--accent)" />
                <span>AI<span style={styles.logoAccent}>Nexus</span></span>
            </button>
            {navItems.map(item => (
                <button
                    key={item.id}
                    style={styles.navItem(activeNav === item.id)}
                    onClick={() => handleNavClick(item.id)}
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
                </button>
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
