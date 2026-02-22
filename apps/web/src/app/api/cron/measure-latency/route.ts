
import { NextResponse } from "next/server";
// @ts-ignore
import { pool } from "@/lib/db";
import { measureGemini, measureOthers } from "@/lib/measure";

export const dynamic = 'force-dynamic'; // No caching

export async function GET() {
    try {
        console.log("Starting pulse measurement...");
        const metrics = [];

        // 1. Measure Real
        const gemini = await measureGemini();
        if (gemini) metrics.push(gemini);

        // 2. Measure Simulated
        const others = await measureOthers();
        metrics.push(...others);

        // 3. Store in DB
        for (const m of metrics) {
            await pool.query(
                `INSERT INTO model_metrics (model_name, latency_ms, tokens_per_second) 
                 VALUES ($1, $2, $3)`,
                [m.model_name, m.latency_ms, m.tokens_per_second]
            );
        }

        return NextResponse.json({ success: true, inserted: metrics.length, metrics });

    } catch (error) {
        console.error("Pulse measurement failed:", error);
        return NextResponse.json({ success: false, error: 'Measurement failed' }, { status: 500 });
    }
}
