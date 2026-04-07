export type DatasetKey = 'small' | 'medium' | 'large' | 'huge';

export type DatasetOption = {
  key: DatasetKey;
  label: string;
  lines: number;
};

export const DATASET_OPTIONS: DatasetOption[] = [
  { key: 'small', label: '1k lines', lines: 1000 },
  { key: 'medium', label: '10k lines', lines: 10000 },
  { key: 'large', label: '50k lines', lines: 50000 },
  { key: 'huge', label: '100k lines', lines: 100000 },
];

function createBaseLine(index: number): string {
  return `Line ${index + 1}: const value_${index} = process_data(item_${index});`;
}

function createChangedLine(index: number): string {
  return `Line ${index + 1}: const nextValue_${index} = processOptimizedData(record_${index});`;
}

export function generateDiffText(lines: number): { oldText: string; newText: string } {
  const oldLines: string[] = [];
  const newLines: string[] = [];

  for (let index = 0; index < lines; index += 1) {
    const oldLine = createBaseLine(index);
    oldLines.push(oldLine);

    if (index % 23 === 0) {
      newLines.push(createChangedLine(index));
      continue;
    }

    if (index % 97 === 0) {
      continue;
    }

    newLines.push(oldLine);

    if (index % 211 === 0) {
      newLines.push(`Inserted line after ${index + 1}: feature_flag_${index} = true;`);
    }
  }

  return {
    oldText: oldLines.join('\n'),
    newText: newLines.join('\n'),
  };
}

export function getDatasetByKey(key: DatasetKey): DatasetOption {
  const dataset = DATASET_OPTIONS.find((item) => item.key === key);

  if (!dataset) {
    return DATASET_OPTIONS[0];
  }

  return dataset;
}