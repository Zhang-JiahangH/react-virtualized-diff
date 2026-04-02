import { diffLines } from 'diff';
import type { DiffLine, RenderItem } from './types';

export function computeDiffLines(
  original: string,
  modified: string,
): DiffLine[] {
  const diffResult = diffLines(original, modified);
  const diffLinesArray: DiffLine[] = [];

  let leftLineNum = 1;
  let rightLineNum = 1;

  diffResult.forEach((part) => {
    const lines = part.value
      .split('\n')
      .filter((line, index, arr) => !(index === arr.length - 1 && line === ''));

    if (part.added) {
      lines.forEach((line) => {
        diffLinesArray.push({
          leftLineNumber: null,
          rightLineNumber: rightLineNum,
          leftContent: '',
          rightContent: line,
          type: 'added',
        });
        rightLineNum += 1;
      });
      return;
    }

    if (part.removed) {
      lines.forEach((line) => {
        diffLinesArray.push({
          leftLineNumber: leftLineNum,
          rightLineNumber: null,
          leftContent: line,
          rightContent: '',
          type: 'removed',
        });
        leftLineNum += 1;
      });
      return;
    }

    lines.forEach((line) => {
      diffLinesArray.push({
        leftLineNumber: leftLineNum,
        rightLineNumber: rightLineNum,
        leftContent: line,
        rightContent: line,
        type: 'unchanged',
      });
      leftLineNum += 1;
      rightLineNum += 1;
    });
  });

  return diffLinesArray;
}

export function buildVisibleMap(
  lines: DiffLine[],
  contextLines: number,
): boolean[] {
  const total = lines.length;
  const visible = new Array<boolean>(total).fill(false);

  lines.forEach((line, index) => {
    if (line.type !== 'unchanged') {
      const start = Math.max(0, index - contextLines);
      const end = Math.min(total - 1, index + contextLines);

      for (let i = start; i <= end; i += 1) {
        visible[i] = true;
      }
    }
  });

  return visible;
}

export function buildRenderItems(
  lines: DiffLine[],
  visibleMap: boolean[],
  expandedBlocks: Record<number, boolean>,
): RenderItem[] {
  const items: RenderItem[] = [];
  const total = lines.length;
  let index = 0;

  while (index < total) {
    if (visibleMap[index]) {
      items.push({ type: 'line', line: lines[index] });
      index += 1;
      continue;
    }

    const blockStart = index;
    while (index < total && !visibleMap[index]) {
      index += 1;
    }

    const blockEnd = index - 1;
    const hiddenCount = blockEnd - blockStart + 1;
    const expanded = expandedBlocks[blockStart] === true;

    if (expanded) {
      for (let i = blockStart; i <= blockEnd; i += 1) {
        items.push({ type: 'line', line: lines[i] });
      }
      items.push({
        type: 'collapse',
        blockStart,
        blockEnd,
        hiddenCount: 0,
        expanded: true,
      });
      continue;
    }

    items.push({
      type: 'collapse',
      blockStart,
      blockEnd,
      hiddenCount,
      expanded: false,
    });
  }

  return items;
}