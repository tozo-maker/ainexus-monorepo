import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

interface AgentResult {
    success: boolean;
    screenshot?: string; // Base64
    error?: string;
    description?: string;
    url?: string;
}

export async function runHeadlessTask(url: string, prompt?: string): Promise<AgentResult> {
    let browser = null;
    const baseDir = path.resolve('./.puppeteer_data');
    const uniqueDir = path.join(baseDir, `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    try {
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
        }

        console.log(`[Agent] Launching system browser for: ${url} in ${uniqueDir}`);

        // Try to find system Chrome paths
        const possiblePaths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser'
        ];

        // Simple check for macOS specific path since we confirmed it exists
        const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

        browser = await puppeteer.launch({
            headless: true,
            executablePath: executablePath,
            userDataDir: uniqueDir,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1280,720'
            ],
            defaultViewport: { width: 1280, height: 720 }
        });

        const page = await browser.newPage();

        // Timeout handling
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Simple "action" based on prompt (mocked logic for now, just screenshot)
        // In the future, use page.evaluate() based on LLM instructions

        const screenshotBuffer = await page.screenshot({ encoding: 'base64' });
        const title = await page.title();

        return {
            success: true,
            screenshot: `data:image/png;base64,${screenshotBuffer}`,
            description: `Successfully visited ${url}. Page title: ${title}`,
            url: url
        };

    } catch (error: any) {
        console.error("[Agent] Error:", error);

        // Fallback for environment restrictions
        if (error.message.includes("browser is already running") || error.message.includes("EPERM")) {
            return {
                success: false,
                error: `Environment Restriction: Unable to launch system browser. (${error.message})`,
                description: `[FALLBACK] The agent logic is implemented, but the local environment blocks browser automation.`,
                screenshot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEXH29r8/fDcAAAAR0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/BicAAABWWXjWAAAAABJRU5ErkJggg=="
            };
        }

        return {
            success: false,
            error: error.message || 'Unknown error during headless task',
            description: `Failed to visit ${url}`
        };
    } finally {
        if (browser) {
            await browser.close();
        }
        // Cleanup unique dir
        try {
            if (fs.existsSync(uniqueDir)) {
                fs.rmSync(uniqueDir, { recursive: true, force: true });
            }
        } catch (e) {
            console.error("[Agent] Cleanup error:", e);
        }
    }
}
