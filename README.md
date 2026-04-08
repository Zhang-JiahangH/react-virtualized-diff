# react-virtualized-diff

High-performance React diff viewer for **large text/code files** with virtualized rendering.

- 📦 npm: [`react-virtualized-diff`](https://www.npmjs.com/package/react-virtualized-diff)
- 🌐 Live Demo: https://www.zhangjiahang.com/react-virtualized-diff
- 📊 Benchmark report: [benchmark-results/results.md](./benchmark-results/results.md)
- 🇨🇳 中文文档: [README.zh-CN.md](./README.zh-CN.md)

## Quick Demo View
![20260408-024125](https://github.com/user-attachments/assets/5345cbe4-04b1-4cfd-bcba-a68fcd7e82aa)

## Why react-virtualized-diff

Most diff components are smooth for small files, but degrade heavily with 10k+ lines.

`react-virtualized-diff` is built for:

- **Virtualized rendering** for big-file performance
- **Side-by-side layout** for easy review
- **Collapsed unchanged blocks** with configurable context
- **TypeScript support** for predictable integration

## Installation

```bash
pnpm add react-virtualized-diff
# or npm i react-virtualized-diff
# or yarn add react-virtualized-diff
```

## Quick Start

```tsx
import { DiffViewer } from 'react-virtualized-diff';

const original = `line 1\nline 2\nline 3`;
const modified = `line 1\nline 2 changed\nline 3\nline 4`;

export function App() {
  return (
    <DiffViewer
      original={original}
      modified={modified}
      contextLines={2}
      height={480}
    />
  );
}
```

## API

### `DiffViewer`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `original` | `string` | - | Original text content (new API) |
| `modified` | `string` | - | Modified text content (new API) |
| `oldValue` | `string` | - | Compatibility API: same as `original` |
| `newValue` | `string` | - | Compatibility API: same as `modified` |
| `splitView` | `boolean` | `true` | `true` for side-by-side, `false` for unified/inline |
| `showDiffOnly` | `boolean` | `true` | Show only changed lines with collapsible unchanged blocks |
| `contextLines` | `number` | `2` | Number of unchanged lines kept around diff hunks |
| `extraLinesSurroundingDiff` | `number` | - | Compatibility API alias for context lines |
| `hideLineNumbers` | `boolean` | `false` | Hide line number columns |
| `highlightLines` | `Array<'L-n' \| 'R-n' \| range>` | - | Highlight specific lines (`L-3`, `R-5`, `L-10-15`) |
| `onLineNumberClick` | `(lineId) => void` | - | Called when a line number is clicked |
| `renderContent` | `(line: string) => ReactNode` | - | Custom line content renderer (syntax highlighting etc.) |
| `compareMethod` | `"CHARS" \| "WORDS" \| "WORDS_WITH_SPACE" \| "LINES" \| "TRIMMED_LINES" \| "SENTENCES" \| "CSS"` | `"LINES"` | Diff compare strategy |
| `disableWordDiff` | `boolean` | `false` | Disable inline word-level diff highlighting |
| `leftTitle` | `ReactNode` | - | Left pane title (split view) |
| `rightTitle` | `ReactNode` | - | Right pane title (split view) |
| `linesOffset` | `number` | `0` | Add offset to displayed line numbers |
| `useDarkTheme` | `boolean` | `false` | Built-in dark theme |
| `styles` | `Partial<DiffViewerStyles>` | - | Override style slots |
| `codeFoldMessageRenderer` | `({ hiddenCount, expanded }) => ReactNode` | - | Custom fold button content renderer |
| `height` | `number \| string` | `500` | Viewport height of the virtual list |
| `locale` | `DiffViewerLocale` | - | UI text localization |
| `language` | `string` | - | Reserved field for future language-related extensions |

### `DiffViewerLocale`

| Field | Type | Description |
| --- | --- | --- |
| `collapse` | `string` | Label for collapse button |
| `showMoreLines` | `(count: number) => string` | Label factory for “show hidden lines” |

## Benchmark

Included benchmark compares:

- `react-virtualized-diff`
- `react-diff-viewer`
- `react-diff-viewer-continued`
- `react-diff-view`

Dataset sizes: `1k / 10k / 50k / 100k` lines.

Metrics:

- FPS (during auto-scroll)
- initial render time
- memory usage (`usedJSHeapSize`)

Quick highlights from the latest report (`2026-04-08T06:45:43.686Z`):

- At `10k` lines (`react-virtualized-diff`): `60.8 FPS`, `127.0 ms` initial render, `9.5 MB` memory.
- At `50k/100k` lines: `react-diff-viewer` and `react-diff-viewer-continued` both timeout (`60000 ms` per case).
- At `100k` lines: `104.0 MB` (`react-virtualized-diff`) vs `1297.0 MB` (`react-diff-view`).

Run benchmark:

```bash
pnpm install
pnpm benchmark
```

## Demo

- Hosted demo page: https://www.zhangjiahang.com/react-virtualized-diff
- Local demo:

```bash
pnpm install
pnpm dev
```

## Monorepo Structure

```text
apps/demo/       # Vite demo app
apps/benchmark/  # benchmark app
packages/react/  # npm package source
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
