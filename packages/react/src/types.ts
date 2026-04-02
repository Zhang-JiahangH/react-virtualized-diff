export type DiffType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  leftLineNumber: number | null;
  rightLineNumber: number | null;
  leftContent: string;
  rightContent: string;
  type: DiffType;
}

export type RenderItem =
  | { type: 'line'; line: DiffLine }
  | {
      type: 'collapse';
      blockStart: number;
      blockEnd: number;
      hiddenCount: number;
      expanded: boolean;
    };

export interface DiffViewerLocale {
  collapse?: string;
  showMoreLines?: (count: number) => string;
}

export interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  contextLines?: number;
  height?: number | string;
  locale?: DiffViewerLocale;
}