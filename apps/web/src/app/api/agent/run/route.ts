import { NextRequest, NextResponse } from 'next/server';
import { runHeadlessTask } from '@/lib/agents/headless';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, prompt } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const result = await runHeadlessTask(url, prompt);
        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
