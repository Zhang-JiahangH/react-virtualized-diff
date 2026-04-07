import { DATASET_OPTIONS, type DatasetKey } from '../data/presets';

export type DemoState = {
  dataset: DatasetKey;
  contextLines: number;
  height: number;
};

type PlaygroundControlsProps = {
  value: DemoState;
  onChange: (nextValue: DemoState) => void;
  onRunStressTest: () => void;
};

export default function PlaygroundControls(props: PlaygroundControlsProps) {
  const { value, onChange, onRunStressTest } = props;

  return (
    <aside className="control-panel">
      <div className="control-panel__section">
        <label className="field-label" htmlFor="dataset">
          Dataset
        </label>
        <select
          id="dataset"
          className="field-input"
          value={value.dataset}
          onChange={(event) =>
            onChange({
              ...value,
              dataset: event.target.value as DatasetKey,
            })
          }
        >
          {DATASET_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-panel__section">
        <label className="field-label" htmlFor="contextLines">
          Context lines: {value.contextLines}
        </label>
        <input
          id="contextLines"
          className="field-range"
          type="range"
          min={0}
          max={20}
          step={1}
          value={value.contextLines}
          onChange={(event) =>
            onChange({
              ...value,
              contextLines: Number(event.target.value),
            })
          }
        />
      </div>

      <div className="control-panel__section">
        <label className="field-label" htmlFor="height">
          Viewer height: {value.height}px
        </label>
        <input
          id="height"
          className="field-range"
          type="range"
          min={240}
          max={960}
          step={40}
          value={value.height}
          onChange={(event) =>
            onChange({
              ...value,
              height: Number(event.target.value),
            })
          }
        />
      </div>

      <button type="button" className="button button--primary button--block" onClick={onRunStressTest}>
        Run 100k stress test
      </button>
    </aside>
  );
}