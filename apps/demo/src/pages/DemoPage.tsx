import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import PlaygroundControls, { type DemoState } from '../components/PlaygroundControls';
import MetricsBar from '../components/MetricsBar';
import { generateDiffText, getDatasetByKey } from '../data/presets';

// 按你的库实际导出改这里
import { DiffViewer } from 'react-virtualized-diff';

const INITIAL_STATE: DemoState = {
  dataset: 'medium',
  contextLines: 3,
  height: 560,
};

type PerfMetrics = {
  prepareTime: number | null;
  commitTime: number | null;
  totalTime: number | null;
};

export default function DemoPage() {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const [metrics, setMetrics] = useState<PerfMetrics>({
    prepareTime: null,
    commitTime: null,
    totalTime: null,
  });

  const interactionStartRef = useRef<number | null>(null);
  const prepareEndRef = useRef<number | null>(null);

  const dataset = useMemo(() => getDatasetByKey(state.dataset), [state.dataset]);

  const diffData = useMemo(() => {
    const prepareStart = performance.now();
    const data = generateDiffText(dataset.lines);
    const prepareEnd = performance.now();

    prepareEndRef.current = prepareEnd;

    setMetrics((previous) => ({
      ...previous,
      prepareTime: prepareEnd - prepareStart,
    }));

    return data;
  }, [dataset.lines]);

  const updateStateWithPerfStart = (nextState: DemoState) => {
    interactionStartRef.current = performance.now();
    prepareEndRef.current = null;
    setMetrics({
      prepareTime: null,
      commitTime: null,
      totalTime: null,
    });
    setState(nextState);
  };

  useLayoutEffect(() => {
    const interactionStart = interactionStartRef.current;

    if (interactionStart === null) {
      return;
    }

    const commitMoment = performance.now();
    const prepareEnd = prepareEndRef.current;

    setMetrics((previous) => ({
      ...previous,
      commitTime: prepareEnd === null ? null : commitMoment - prepareEnd,
      totalTime: commitMoment - interactionStart,
    }));
  }, [diffData, state.contextLines, state.height]);

  useEffect(() => {
    if (interactionStartRef.current === null) {
      interactionStartRef.current = performance.now();
    }
  }, []);

  return (
    <div className="site-page">
      <SiteHeader />

      <main className="page-shell demo-page">
        <div className="section-heading section-heading--compact">
          <h1>Interactive demo</h1>
          <p>
            Switch dataset size, viewport height, and context settings to see how the diff viewer
            behaves under different conditions.
          </p>
        </div>

        <div className="demo-layout">
          <PlaygroundControls
            value={state}
            onChange={updateStateWithPerfStart}
            onRunStressTest={() =>
              updateStateWithPerfStart({
                dataset: 'huge',
                contextLines: 2,
                height: 720,
              })
            }
          />

          <section className="demo-viewer-card">
            <div className="demo-viewer-card__header">
              <div>
                <h2>Viewer</h2>
                <p>
                  Current dataset: <strong>{dataset.label}</strong>
                </p>
              </div>
            </div>

            <div className="demo-viewer-card__body">
              <DiffViewer
                original={diffData.oldText}
                modified={diffData.newText}
                height={state.height}
                contextLines={state.contextLines}
              />
            </div>
          </section>
        </div>

        <MetricsBar
          lineCount={dataset.lines}
          contextLines={state.contextLines}
          height={state.height}
          prepareTime={metrics.prepareTime}
          commitTime={metrics.commitTime}
          totalTime={metrics.totalTime}
        />
      </main>
    </div>
  );
}