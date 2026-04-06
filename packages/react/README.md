# react-virtualized-diff

React virtualized diff viewer for large text/code files.

> This package is part of the `virtualized-diff-viewer` monorepo.

## Install

```bash
npm install react-virtualized-diff
```

## Usage

```tsx
import { DiffViewer } from 'react-virtualized-diff';

<DiffViewer original={oldText} modified={newText} contextLines={2} height={500} />;
```

## Props

- `original: string`
- `modified: string`
- `contextLines?: number`
- `height?: number | string`

## Links

- Repository README: `../../README.md`
- Chinese README: `../../README.zh-CN.md`
- Changelog: `../../CHANGELOG.md`
