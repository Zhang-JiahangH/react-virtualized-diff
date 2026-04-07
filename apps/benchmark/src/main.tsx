import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactDiffViewer from 'react-diff-viewer';
import { Diff, Hunk, parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { DiffViewer } from 'react-virtualized-diff';

type LibraryName = 'virtualized-diff-viewer' | 'react-diff-viewer' | 'react-diff-viewer-continued' | 'react-diff-view';

type BenchmarkParams = {
  lib: LibraryName;
  lines: number;
  height: number;
};

type BenchmarkResult = {
  lib: LibraryName;
  lines: number;
  initialRenderTimeMs: number;
  averageFps: number;
  memoryBytes: number | null;
  userAgent: string;
};

type DiffViewerLikeComponent = React.ComponentType<any>;

declare global {
  interface Window {
    __BENCHMARK_DONE__?: boolean;
    __BENCHMARK_RESULT__?: BenchmarkResult;
  }
}

const CONTINUED_PKG = 'react-diff-viewer-continued';

const defaultParams: BenchmarkParams = {
  lib: 'virtualized-diff-viewer',
  lines: 1000,
  height: 720,
};

function parseParams(): BenchmarkParams {
  const params = new URLSearchParams(window.location.search);
  const lib = (params.get('lib') as LibraryName | null) ?? defaultParams.lib;
  const lines = Number(params.get('lines') ?? defaultParams.lines);
  const height = Number(params.get('height') ?? defaultParams.height);

  const normalizedLib: LibraryName =
    lib === 'react-diff-view' || lib === 'react-diff-viewer' || lib === 'react-diff-viewer-continued' || lib === 'virtualized-diff-viewer'
      ? lib
      : defaultParams.lib;

  return {
    lib: normalizedLib,
    lines: Number.isFinite(lines) && lines > 0 ? lines : defaultParams.lines,
    height: Number.isFinite(height) && height > 0 ? height : defaultParams.height,
  };
}

function generateTexts(lines: number): { oldText: string; newText: string; unifiedDiff: string } {
  const oldLines: string[] = [];
  const newLines: string[] = [];

  for (let i = 0; i < lines; i += 1) {
    const base = `line ${i + 1} : ${'x'.repeat(40)} ${(i % 7).toString(16)}`;
    oldLines.push(base);

    if (i % 20 === 0) {
      newLines.push(`${base} [updated]`);
      continue;
    }

    if (i % 125 === 0) {
      continue;
    }

    newLines.push(base);

    if (i % 90 === 0) {
      newLines.push(`inserted after ${i + 1} : ${'y'.repeat(24)}`);
    }
  }

  const oldText = oldLines.join('\n');
  const newText = newLines.join('\n');

  const unifiedDiff = [
    'diff --git a/benchmark.txt b/benchmark.txt',
    '--- a/benchmark.txt',
    '+++ b/benchmark.txt',
    `@@ -1,${oldLines.length} +1,${newLines.length} @@`,
    ...oldLines.map((line) => `-${line}`),
    ...newLines.map((line) => `+${line}`),
  ].join('\n');

  return { oldText, newText, unifiedDiff };
}

function App() {
  const params = React.useMemo(parseParams, []);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [payload] = React.useState(() => generateTexts(params.lines));
  const [continuedViewer, setContinuedViewer] = React.useState<DiffViewerLikeComponent>(() => ReactDiffViewer);

  React.useEffect(() => {
    let mounted = true;

    import(/* @vite-ignore */ CONTINUED_PKG)
      .then((mod: unknown) => {
        if (!mounted) return;
        const loaded = ((mod as { default?: DiffViewerLikeComponent }).default ?? mod) as DiffViewerLikeComponent;
        if (loaded) {
          setContinuedViewer(() => loaded);
        }
      })
      .catch(() => {
        console.warn(`[benchmark] Optional dependency not found: ${CONTINUED_PKG}. Falling back to react-diff-viewer.`);
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    const markDone = async () => {
      const initialRenderTimeMs = performance.now();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const container = containerRef.current;
      let frameCount = 0;
      const durationMs = 2500;
      const start = performance.now();
      let rafId = 0;

      const tick = (now: number) => {
        frameCount += 1;
        if (container) {
          const maxScroll = container.scrollHeight - container.clientHeight;
          if (maxScroll > 0) {
            const progress = Math.min(1, (now - start) / durationMs);
            container.scrollTop = maxScroll * progress;
          }
        }
        if (now - start < durationMs) {
          rafId = requestAnimationFrame(tick);
        } else {
          const averageFps = (frameCount * 1000) / durationMs;
          const memory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory;
          const result: BenchmarkResult = {
            lib: params.lib,
            lines: params.lines,
            initialRenderTimeMs,
            averageFps,
            memoryBytes: memory?.usedJSHeapSize ?? null,
            userAgent: navigator.userAgent,
          };
          window.__BENCHMARK_RESULT__ = result;
          window.__BENCHMARK_DONE__ = true;
        }
      };

      rafId = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(rafId);
    };

    markDone();
  }, [params.lib, params.lines]);

  let viewer: React.ReactNode;

  if (params.lib === 'virtualized-diff-viewer') {
    viewer = <DiffViewer original={payload.oldText} modified={payload.newText} height={params.height} />;
  } else if (params.lib === 'react-diff-viewer') {
    viewer = (
      <ReactDiffViewer
        oldValue={payload.oldText}
        newValue={payload.newText}
        splitView
        showDiffOnly={false}
      />
    );
  } else if (params.lib === 'react-diff-viewer-continued') {
    const ContinuedViewer = continuedViewer;
    viewer = (
      <ContinuedViewer
        oldValue={payload.oldText}
        newValue={payload.newText}
        splitView
        showDiffOnly={false}
      />
    );
  } else {
    const files = parseDiff(payload.unifiedDiff);
    const file = files[0];
    viewer = file ? (
      <Diff viewType="split" diffType={file.type} hunks={file.hunks}>
        {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>
    ) : null;
  }

  return (
    <main style={{ padding: 12, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Diff benchmark runner</h1>
      <div
        ref={containerRef}
        style={{
          border: '1px solid #ddd',
          borderRadius: 6,
          overflow: 'auto',
          height: params.height,
          background: '#fff',
        }}
      >
        {viewer}
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
