import type { DiffViewerLocale } from './types';

export const defaultLocale: Required<DiffViewerLocale> = {
  collapse: 'Collapse',
  showMoreLines: (count: number) => `Show ${count} more lines`,
};