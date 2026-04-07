import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const libs = ['virtualized-diff-viewer', 'react-diff-viewer', 'react-diff-view'];
const sizes = [1000, 10000, 50000, 100000];
const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(retries = 60) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {
      // ignore
    }
    await sleep(500);
  }
  throw new Error(`Benchmark app did not start on ${baseUrl}`);
}

function formatBytes(bytes) {
  if (bytes == null) return 'N/A';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function toMarkdown(results) {
  const header = '| Library | Lines | Initial Render (ms) | FPS | Memory |';
  const sep = '| --- | ---: | ---: | ---: | ---: |';
  const rows = results.map((item) => {
    return `| ${item.lib} | ${item.lines.toLocaleString()} | ${item.initialRenderTimeMs.toFixed(2)} | ${item.averageFps.toFixed(2)} | ${formatBytes(item.memoryBytes)} |`;
  });
  return [
    '# Benchmark Results',
    '',
    `Generated at: ${new Date().toISOString()}`,
    '',
    '> Memory usage comes from `performance.memory.usedJSHeapSize` and is only available in Chromium-based browsers.',
    '',
    header,
    sep,
    ...rows,
    '',
  ].join('\n');
}

function installPlaywrightBrowser() {
  console.log('Playwright browser is missing, installing Chromium...');
  const install = spawnSync('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
    stdio: 'inherit',
    env: process.env,
  });

  if (install.status !== 0) {
    throw new Error('Failed to install Playwright Chromium. Please run `pnpm exec playwright install chromium`.');
  }
}

async function launchBrowserWithAutoInstall() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("Executable doesn't exist")) {
      throw error;
    }

    installPlaywrightBrowser();
    return chromium.launch({ headless: true });
  }
}

const devServer = spawn('pnpm', ['--filter', 'benchmark-app', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, CI: '1' },
});

try {
  await waitForServer();
  const browser = await launchBrowserWithAutoInstall();
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];

  for (const lib of libs) {
    for (const lines of sizes) {
      const url = `${baseUrl}/?lib=${encodeURIComponent(lib)}&lines=${lines}`;
      console.log(`Running benchmark: ${lib} @ ${lines.toLocaleString()} lines`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__BENCHMARK_DONE__ === true, { timeout: 180000 });
      const result = await page.evaluate(() => window.__BENCHMARK_RESULT__);
      if (!result) {
        throw new Error(`No benchmark result for ${lib} ${lines}`);
      }
      results.push(result);
    }
  }

  await browser.close();

  const outDir = resolve('benchmark-results');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
  writeFileSync(resolve(outDir, 'results.md'), `${toMarkdown(results)}\n`, 'utf8');

  console.log(`Benchmark complete. Wrote ${results.length} records to benchmark-results/.`);
} finally {
  devServer.kill('SIGTERM');
}
