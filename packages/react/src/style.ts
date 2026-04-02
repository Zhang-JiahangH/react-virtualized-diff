import type { DiffType } from './types';

export function getBackgroundColor(type: DiffType, visible: boolean): string {
  if (!visible) {
    return '#fff';
  }

  switch (type) {
    case 'added':
      return '#e6ffed';
    case 'removed':
      return '#ffeef0';
    default:
      return '#fff';
  }
}

export function getPrefix(type: DiffType, visible: boolean): string {
  if (!visible) {
    return '';
  }

  switch (type) {
    case 'added':
      return '+';
    case 'removed':
      return '-';
    default:
      return '';
  }
}