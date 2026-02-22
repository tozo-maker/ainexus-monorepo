const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
    const url = 'http://example.com';
    let browser = null;
    const baseDir = path.resolve(__dirname, '../.puppeteer_data');
    const uniqueDir = path.join(baseDir, `test-session-${Date.now()}`);

    try {
        // if (!fs.existsSync(baseDir)) { fs.mkdirSync(baseDir, { recursive: true }); }

        console.log(`[Test] Launching system browser for: ${url} in ${uniqueDir}`);

        const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

        browser = await puppeteer.launch({
            headless: true,
            executablePath: executablePath,
            userDataDir: uniqueDir,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--remote-debugging-port=0',
                `--user-data-dir=${uniqueDir}`,
                `--crash-dumps-dir=${uniqueDir}/crashpad`,
                `--disk-cache-dir=${uniqueDir}/cache`
            ],
            defaultViewport: { width: 1280, height: 720 },
            ignoreDefaultArgs: ['--enable-automation'] // Sometimes helps?
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const screenshot = await page.screenshot({ encoding: 'base64' });
        console.log('[Test] Success! Screenshot length:', screenshot.length);

    } catch (error) {
        console.error('[Test] Error:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('[Test] Browser closed');
        }
        // Cleanup
        try {
            if (fs.existsSync(uniqueDir)) {
                fs.rmSync(uniqueDir, { recursive: true, force: true });
                console.log('[Test] Cleanup done');
            }
        } catch (e) {
            console.error("[Test] Cleanup error:", e);
        }
    }
}

run();
