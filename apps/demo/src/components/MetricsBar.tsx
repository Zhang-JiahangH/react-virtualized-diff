type MetricsBarProps = {
  lineCount: number;
  contextLines: number;
  height: number;
  prepareTime: number | null;
  commitTime: number | null;
  totalTime: number | null;
};

function formatDuration(value: number | null): string {
  if (value === null) {
    return '--';
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} s`;
  }

  return `${value.toFixed(1)} ms`;
}

export default function MetricsBar(props: MetricsBarProps) {
  const { lineCount, contextLines, height, prepareTime, commitTime, totalTime } = props;

  return (
    <section className="metrics-bar">
      <div className="metric-card">
        <span className="metric-card__label">Lines</span>
        <strong className="metric-card__value">{lineCount.toLocaleString()}</strong>
      </div>

      <div className="metric-card">
        <span className="metric-card__label">Context</span>
        <strong className="metric-card__value">{contextLines}</strong>
      </div>

      <div className="metric-card">
        <span className="metric-card__label">Height</span>
        <strong className="metric-card__value">{height}px</strong>
      </div>

      <div className="metric-card">
        <span className="metric-card__label">Prepare</span>
        <strong className="metric-card__value">{formatDuration(prepareTime)}</strong>
      </div>

      <div className="metric-card">
        <span className="metric-card__label">Commit</span>
        <strong className="metric-card__value">{formatDuration(commitTime)}</strong>
      </div>

      <div className="metric-card">
        <span className="metric-card__label">Total</span>
        <strong className="metric-card__value">{formatDuration(totalTime)}</strong>
      </div>
    </section>
  );
}