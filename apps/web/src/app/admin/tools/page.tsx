import React from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ExternalLink, Edit2, Trash2, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminToolsPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll() {
                    /* Handled */
                },
            },
        }
    );

    const { data: tools, error } = await supabase
        .from("tools")
        .select(`
            id,
            name,
            tagline,
            created_at,
            website_url,
            pricing_model,
            categories ( name )
        `)
        .order("created_at", { ascending: false })
        .limit(50); // Pagination for scale

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)]">Tools Database</h1>
                    <p className="text-[var(--muted)]">Manage the AI directory catalog</p>
                </div>
                <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-bold shadow-sm shadow-[var(--accent-glow)] flex items-center gap-2 text-sm">
                    Add New Tool
                </button>
            </div>

            <div className="w-full bg-[rgba(255,255,255,0.01)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[var(--border)] flex items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-[var(--muted)] text-sm">
                                <th className="p-4 font-semibold uppercase tracking-wider">Tool Name</th>
                                <th className="p-4 font-semibold uppercase tracking-wider">Category</th>
                                <th className="p-4 font-semibold uppercase tracking-wider">Pricing</th>
                                <th className="p-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {(tools || []).map((t) => (
                                <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-[var(--foreground)]">{t.name}</div>
                                        <div className="text-[var(--muted)] truncate max-w-[250px]">{t.tagline}</div>
                                    </td>
                                    <td className="p-4 text-[var(--muted)]">
                                        {Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as any)?.name || "Uncategorized"}
                                    </td>
                                    <td className="p-4 text-[var(--muted)]">
                                        <span className="px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] text-xs font-semibold capitalize">
                                            {t.pricing_model || "unknown"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={t.website_url} target="_blank" className="text-[var(--muted)] hover:text-blue-500">
                                                <ExternalLink size={16} />
                                            </Link>
                                            <button className="text-[var(--muted)] hover:text-green-500"><Edit2 size={16} /></button>
                                            <button className="text-[var(--muted)] hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
