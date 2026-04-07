import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const libs = ['virtualized-diff-viewer', 'react-diff-viewer', 'react-diff-viewer-continued', 'react-diff-view'];
const sizes = [1000, 10000, 50000, 100000];
const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;
const perCaseTimeoutMs = 60000;

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
  const header = '| Library | Lines | Status | Initial Render (ms) | FPS | Memory | Note |';
  const sep = '| --- | ---: | --- | ---: | ---: | ---: | --- |';
  const rows = results.map((item) => {
    const renderTime = item.initialRenderTimeMs == null ? 'N/A' : item.initialRenderTimeMs.toFixed(2);
    const fps = item.averageFps == null ? 'N/A' : item.averageFps.toFixed(2);
    return `| ${item.lib} | ${item.lines.toLocaleString()} | ${item.status} | ${renderTime} | ${fps} | ${formatBytes(item.memoryBytes)} | ${item.note ?? ''} |`;
  });
  return [
    '# Benchmark Results',
    '',
    `Generated at: ${new Date().toISOString()}`,
    '',
    `Per-case timeout: ${perCaseTimeoutMs} ms`,
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

function startDevServer() {
  return spawn('pnpm', ['exec', 'vite', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: resolve('apps/benchmark'),
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
  });
}

async function stopDevServer(devServer) {
  if (!devServer || devServer.killed) {
    return;
  }

  const exitPromise = new Promise((resolveExit) => {
    devServer.once('exit', (code, signal) => {
      const isExpected = signal === 'SIGTERM' || code === 0 || code === 143;
      if (!isExpected) {
        console.warn(`Benchmark dev server exited unexpectedly: code=${code}, signal=${signal}`);
      }
      resolveExit();
    });
  });

  devServer.kill('SIGTERM');
  await exitPromise;
}

const devServer = startDevServer();

try {
  await waitForServer();
  const browser = await launchBrowserWithAutoInstall();
  const context = await browser.newContext();
  const results = [];

  for (const lib of libs) {
    for (const lines of sizes) {
      const url = `${baseUrl}/?lib=${encodeURIComponent(lib)}&lines=${lines}`;
      console.log(`Running benchmark: ${lib} @ ${lines.toLocaleString()} lines`);

      const page = await context.newPage();
      page.setDefaultTimeout(perCaseTimeoutMs);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: perCaseTimeoutMs });
        await page.waitForFunction(() => window.__BENCHMARK_DONE__ === true, { timeout: perCaseTimeoutMs });
        const result = await page.evaluate(() => window.__BENCHMARK_RESULT__);
        if (!result) {
          throw new Error(`No benchmark result for ${lib} ${lines}`);
        }
        results.push({ ...result, status: 'ok', note: null });
      } catch (error) {
        if (error instanceof Error && error.name === 'TimeoutError') {
          const note = `Did not finish within ${perCaseTimeoutMs} ms`;
          console.warn(`Timeout: ${lib} @ ${lines.toLocaleString()} lines. ${note}`);
          results.push({
            lib,
            lines,
            initialRenderTimeMs: null,
            averageFps: null,
            memoryBytes: null,
            userAgent: null,
            status: 'timeout',
            note,
          });
        } else {
          throw error;
        }
      } finally {
        await page.close();
      }
    }
  }

  await context.close();
  await browser.close();

  const outDir = resolve('benchmark-results');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'results.json'), `${JSON.stringify(results, null, 2)}\n`, 'utf8');
  writeFileSync(resolve(outDir, 'results.md'), `${toMarkdown(results)}\n`, 'utf8');

  const timeoutCount = results.filter((item) => item.status === 'timeout').length;
  console.log(`Benchmark complete. Wrote ${results.length} records to benchmark-results/. Timeouts: ${timeoutCount}.`);
} finally {
  await stopDevServer(devServer);
}
