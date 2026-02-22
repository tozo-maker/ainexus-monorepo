import React from "react";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database, TrendingUp, Users, Activity } from "lucide-react";

export default async function AdminOverviewPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { /* Handled in middleware */ },
            },
        }
    );

    // Fetch Stats
    const [{ count: totalTools }, { count: totalCategories }] = await Promise.all([
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true })
    ]);

    const stats = [
        { label: "Total Tools", value: totalTools || 0, icon: <Database className="text-blue-500" />, trend: "+12 this week" },
        { label: "Categories", value: totalCategories || 0, icon: <Activity className="text-purple-500" />, trend: "Active" },
        { label: "Users", value: "---", icon: <Users className="text-green-500" />, trend: "Auth data protected" },
        { label: "Page Views", value: "---", icon: <TrendingUp className="text-orange-500" />, trend: "Needs analytics integration" }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)]">Overview</h1>
            <p className="text-[var(--muted)] mb-8">System metrics and database health.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.01)] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-sm font-medium text-[var(--muted)]">{stat.label}</div>
                            {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-[var(--foreground)] mb-1">{stat.value}</div>
                        <div className="text-xs text-[var(--muted)]">{stat.trend}</div>
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.01)] shadow-sm">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Recent System Activity</h3>
                <div className="text-sm text-[var(--muted)] text-center py-12 border border-dashed border-[var(--border)] rounded-lg">
                    No recent activity logs found.
                </div>
            </div>
        </div>
    );
}
