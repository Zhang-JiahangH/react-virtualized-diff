import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DiffViewer } from 'react-virtualized-diff';

type LibraryKey = 'ours' | 'reactDiffViewer' | 'reactDiffView';

type LibraryResult = {
  fps: number | null;
  initialRenderMs: number | null;
  memoryMB: number | null;
  status: 'idle' | 'running' | 'done' | 'error' | 'unavailable';
  message?: string;
};

type BenchmarkRow = {
  size: string;
  lines: number;
  results: Record<LibraryKey, LibraryResult>;
};

type DiffSample = {
  original: string;
  modified: string;
  unified: string;
};

type BenchmarkAdapter = {
  name: string;
  render: (sample: DiffSample) => React.ReactElement;
};

const BENCHMARK_SIZES = [1000, 10000, 50000, 100000];

const initialResult = (): LibraryResult => ({
  fps: null,
  initialRenderMs: null,
  memoryMB: null,
  status: 'idle',
});

const makeInitialRows = (): BenchmarkRow[] =>
  BENCHMARK_SIZES.map((lines) => ({
    size: `${Math.floor(lines / 1000)}k lines`,
    lines,
    results: {
      ours: initialResult(),
      reactDiffViewer: initialResult(),
      reactDiffView: initialResult(),
    },
  }));

const original = `import React from 'react';

export function hello() {
  return 'hello';
}

export function sum(a: number, b: number) {
  return a + b;
}

// unchanged line 1
// unchanged line 2
// unchanged line 3
// unchanged line 4
// unchanged line 5
`;

const modified = `import React from 'react';

export function hello() {
  return 'hello world';
}

export function sum(a: number, b: number) {
  return a + b + 1;
}

// unchanged line 1
// unchanged line 2
// unchanged line 3
// unchanged line 4
// unchanged line 5
`;

function HomePage(): React.JSX.Element {
  return (
    <div className="page">
      <h1>virtualized-diff-viewer demo</h1>
      <p>A high-performance React diff viewer for large files.</p>
      <p>
        Benchmark page: <a href="/benchmark">/benchmark</a>
      </p>

      <DiffViewer
        original={original}
        modified={modified}
        contextLines={2}
        height={500}
      />
    </div>
  );
}

function getHeapMB(): number | null {
  type PerfWithMemory = Performance & {
    memory?: {
      usedJSHeapSize: number;
    };
  };

  const memory = (performance as PerfWithMemory).memory;
  if (!memory?.usedJSHeapSize) {
    return null;
  }
  return memory.usedJSHeapSize / 1024 / 1024;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function measureFPS(durationMs = 1000): Promise<number> {
  let frames = 0;
  const start = performance.now();

  return new Promise((resolve) => {
    const tick = (): void => {
      frames += 1;
      const now = performance.now();
      if (now - start >= durationMs) {
        const fps = frames / ((now - start) / 1000);
        resolve(Number(fps.toFixed(1)));
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

function createSample(lines: number): DiffSample {
  const oldLines: string[] = [];
  const newLines: string[] = [];
  const hunkLines: string[] = [];

  for (let i = 1; i <= lines; i += 1) {
    const oldLine = `const line_${i} = ${i};`;
    const newLine = i % 10 === 0 ? `const line_${i} = ${i + 1};` : oldLine;
    oldLines.push(oldLine);
    newLines.push(newLine);

    if (oldLine === newLine) {
      hunkLines.push(` ${oldLine}`);
    } else {
      hunkLines.push(`-${oldLine}`);
      hunkLines.push(`+${newLine}`);
    }
  }

  const unified = [
    '--- a/sample.ts',
    '+++ b/sample.ts',
    `@@ -1,${lines} +1,${lines} @@`,
    ...hunkLines,
  ].join('\n');

  return {
    original: oldLines.join('\n'),
    modified: newLines.join('\n'),
    unified,
  };
}

async function loadFromEsm(url: string): Promise<Record<string, unknown>> {
  return import(/* @vite-ignore */ url) as Promise<Record<string, unknown>>;
}

async function getAdapters(): Promise<Record<LibraryKey, BenchmarkAdapter | null>> {
  const ours: BenchmarkAdapter = {
    name: 'virtualized-diff',
    render: (sample) => (
      <DiffViewer
        original={sample.original}
        modified={sample.modified}
        contextLines={2}
        height={600}
      />
    ),
  };

  let reactDiffViewerAdapter: BenchmarkAdapter | null = null;
  try {
    const mod = await loadFromEsm('https://esm.sh/react-diff-viewer@3.1.1?bundle');
    const ReactDiffViewer = (mod.default ?? mod.ReactDiffViewer) as React.ComponentType<{
      oldValue: string;
      newValue: string;
      splitView?: boolean;
    }>;

    reactDiffViewerAdapter = {
      name: 'react-diff-viewer',
      render: (sample) => (
        <ReactDiffViewer
          oldValue={sample.original}
          newValue={sample.modified}
          splitView
        />
      ),
    };
  } catch {
    reactDiffViewerAdapter = null;
  }

  let reactDiffViewAdapter: BenchmarkAdapter | null = null;
  try {
    const mod = await loadFromEsm('https://esm.sh/react-diff-view@3.2.0?bundle');

    const Diff = mod.Diff as React.ComponentType<Record<string, unknown>>;
    const Hunk = mod.Hunk as React.ComponentType<Record<string, unknown>>;
    const parseDiff = mod.parseDiff as ((text: string) => Array<Record<string, unknown>>) | undefined;

    if (Diff && Hunk && parseDiff) {
      reactDiffViewAdapter = {
        name: 'react-diff-view',
        render: (sample) => {
          const files = parseDiff(sample.unified);
          const file = files[0] as {
            hunks: Array<{ content: string }>;
            type: string;
          };

          return (
            <Diff viewType="split" diffType={file.type} hunks={file.hunks}>
              {(hunks: Array<{ content: string }>) =>
                hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
              }
            </Diff>
          );
        },
      };
    }
  } catch {
    reactDiffViewAdapter = null;
  }

  return {
    ours,
    reactDiffViewer: reactDiffViewerAdapter,
    reactDiffView: reactDiffViewAdapter,
  };
}

async function measureAdapter(adapter: BenchmarkAdapter, sample: DiffSample): Promise<LibraryResult> {
  const mountNode = document.createElement('div');
  mountNode.style.position = 'fixed';
  mountNode.style.left = '-200vw';
  mountNode.style.top = '0';
  mountNode.style.width = '1280px';
  mountNode.style.height = '720px';
  mountNode.style.overflow = 'auto';
  document.body.appendChild(mountNode);

  const beforeHeap = getHeapMB();
  const start = performance.now();

  try {
    const root = createRoot(mountNode);
    root.render(adapter.render(sample));

    await nextFrame();
    await nextFrame();

    const initialRenderMs = Number((performance.now() - start).toFixed(1));
    const fps = await measureFPS(1000);
    const afterHeap = getHeapMB();

    root.unmount();
    mountNode.remove();

    return {
      fps,
      initialRenderMs,
      memoryMB:
        beforeHeap === null || afterHeap === null
          ? null
          : Number(Math.max(afterHeap - beforeHeap, 0).toFixed(1)),
      status: 'done',
    };
  } catch (error) {
    mountNode.remove();

    return {
      fps: null,
      initialRenderMs: null,
      memoryMB: null,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown render error',
    };
  }
}

function formatMetric(value: number | null, unit = ''): string {
  if (value === null) {
    return 'N/A';
  }
  return `${value}${unit}`;
}

function MetricBars({
  title,
  values,
}: {
  title: string;
  values: { label: string; value: number | null }[];
}): React.JSX.Element {
  const numericValues = values.map((item) => item.value ?? 0);
  const max = Math.max(...numericValues, 1);

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {values.map((item) => {
        const width = item.value === null ? 0 : (item.value / max) * 100;
        return (
          <div key={item.label} className="bar-row">
            <span>{item.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.max(width, 5)}%` }} />
            </div>
            <strong>{item.value === null ? 'N/A' : item.value}</strong>
          </div>
        );
      })}
    </div>
  );
}

function BenchmarkPage(): React.JSX.Element {
  const [rows, setRows] = useState<BenchmarkRow[]>(() => makeInitialRows());
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState('点击 Run benchmark 之后才会产生数据（不再预填捏造值）。');

  const rowsBySize = useMemo(() => new Map(rows.map((row) => [row.lines, row])), [rows]);

  async function runBenchmark(): Promise<void> {
    setRunning(true);
    setRows(makeInitialRows());
    setProgress('Loading benchmark adapters...');

    const adapters = await getAdapters();
    const keys: LibraryKey[] = ['ours', 'reactDiffViewer', 'reactDiffView'];

    for (const lines of BENCHMARK_SIZES) {
      const sample = createSample(lines);

      for (const key of keys) {
        const adapter = adapters[key];

        setRows((prev) =>
          prev.map((row) =>
            row.lines !== lines
              ? row
              : {
                  ...row,
                  results: {
                    ...row.results,
                    [key]: {
                      ...row.results[key],
                      status: adapter ? 'running' : 'unavailable',
                      message: adapter ? undefined : 'Adapter unavailable (CDN load failed)',
                    },
                  },
                },
          ),
        );

        if (!adapter) {
          continue;
        }

        setProgress(`Running ${adapter.name} @ ${lines} lines...`);
        const result = await measureAdapter(adapter, sample);

        setRows((prev) =>
          prev.map((row) =>
            row.lines !== lines
              ? row
              : {
                  ...row,
                  results: {
                    ...row.results,
                    [key]: result,
                  },
                },
          ),
        );
      }
    }

    setProgress('Benchmark done.');
    setRunning(false);
  }

  const row50k = rowsBySize.get(50000);
  const ours50k = row50k?.results.ours.initialRenderMs ?? null;
  const viewer50k = row50k?.results.reactDiffViewer.initialRenderMs ?? null;
  const speedup50k =
    ours50k && viewer50k ? Number((viewer50k / ours50k).toFixed(1)) : null;

  const row100k = rowsBySize.get(100000);

  return (
    <div className="page benchmark-page">
      <h1>Benchmark</h1>
      <p>
        数据维度：1k / 10k / 50k / 100k lines diff；指标：FPS / initial render time /
        memory usage；对比对象：react-diff-viewer / react-diff-view。
      </p>

      <div className="benchmark-actions">
        <button type="button" onClick={() => void runBenchmark()} disabled={running}>
          {running ? 'Benchmarking...' : 'Run benchmark'}
        </button>
        <span>{progress}</span>
      </div>

      <table className="benchmark-table">
        <thead>
          <tr>
            <th>Diff size</th>
            <th>FPS (ours / viewer / view)</th>
            <th>Initial render ms (ours / viewer / view)</th>
            <th>Memory MB (ours / viewer / view)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.size}>
              <td>{row.size}</td>
              <td>
                {formatMetric(row.results.ours.fps)} /{' '}
                {formatMetric(row.results.reactDiffViewer.fps)} /{' '}
                {formatMetric(row.results.reactDiffView.fps)}
              </td>
              <td>
                {formatMetric(row.results.ours.initialRenderMs, 'ms')} /{' '}
                {formatMetric(row.results.reactDiffViewer.initialRenderMs, 'ms')} /{' '}
                {formatMetric(row.results.reactDiffView.initialRenderMs, 'ms')}
              </td>
              <td>
                {formatMetric(row.results.ours.memoryMB, 'MB')} /{' '}
                {formatMetric(row.results.reactDiffViewer.memoryMB, 'MB')} /{' '}
                {formatMetric(row.results.reactDiffView.memoryMB, 'MB')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="charts">
        <MetricBars
          title="100k lines FPS"
          values={[
            { label: 'virtualized-diff', value: row100k?.results.ours.fps ?? null },
            {
              label: 'react-diff-viewer',
              value: row100k?.results.reactDiffViewer.fps ?? null,
            },
            { label: 'react-diff-view', value: row100k?.results.reactDiffView.fps ?? null },
          ]}
        />
        <MetricBars
          title="100k lines memory MB"
          values={[
            { label: 'virtualized-diff', value: row100k?.results.ours.memoryMB ?? null },
            {
              label: 'react-diff-viewer',
              value: row100k?.results.reactDiffViewer.memoryMB ?? null,
            },
            {
              label: 'react-diff-view',
              value: row100k?.results.reactDiffView.memoryMB ?? null,
            },
          ]}
        />
      </div>

      <p className="conclusion">
        结论：
        {speedup50k
          ? `Rendering 50k lines: ${speedup50k}x faster than react-diff-viewer (initial render time).`
          : '请先运行 benchmark，结论会基于实测结果自动生成。'}
      </p>

      <p className="note">
        说明：本页不再写死数据，所有数值来自当前浏览器环境实测；若 CDN 无法加载第三方库，会显示
        N/A。
      </p>
    </div>
  );
}

export default function App(): React.JSX.Element {
  if (window.location.pathname === '/benchmark') {
    return <BenchmarkPage />;
  }

  return <HomePage />;
}
