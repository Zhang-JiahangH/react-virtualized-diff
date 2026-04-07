# virtualized-diff-viewer

A high-performance, virtualized React diff viewer designed for **very large text files** and smooth developer experience.

> Package name on npm: **`react-virtualized-diff`**

[中文文档（Chinese README）](./README.zh-CN.md)

---

## Why this project

Most diff viewers are good for small files but become slow when input grows to tens of thousands of lines.

`virtualized-diff-viewer` focuses on:

- **Performance first** rendering with virtualization
- **Readable side-by-side UI** for code/text review
- **Configurable context lines** around changes
- **TypeScript support** for reliable integration
- **Simple React API** for quick adoption

---

## Features

- ✅ Side-by-side diff layout
- ✅ Virtualized row rendering (good for large files)
- ✅ Collapsed unchanged blocks with configurable context
- ✅ Lightweight integration in React apps
- ✅ TypeScript declarations out of the box

---

## Installation

```bash
# pnpm
pnpm add react-virtualized-diff

# npm
npm install react-virtualized-diff

# yarn
yarn add react-virtualized-diff
```

---

## Quick start

```tsx
import { DiffViewer } from 'react-virtualized-diff';

const oldText = `line 1\nline 2\nline 3`;
const newText = `line 1\nline 2 changed\nline 3\nline 4`;

export function Example() {
  return (
    <DiffViewer
      original={oldText}
      modified={newText}
      contextLines={2}
      height={480}
    />
  );
}
```

---

## API (current)

### `DiffViewer` props

- `original: string` – original text content
- `modified: string` – modified text content
- `contextLines?: number` – unchanged lines to keep around changes (default behavior from component)
- `height?: number | string` – viewport height for virtualization container

> Tip: for best performance with huge files, keep rendering area constrained with a fixed `height`.

---

## Benchmark suite

A runnable benchmark harness is included to compare:

- `react-virtualized-diff` (this project)
- `react-diff-viewer`
- `react-diff-viewer-continued`
- `react-diff-view`

Metrics collected for each dataset size (`1k / 10k / 50k / 100k` lines):

- FPS (average during auto-scroll)
- Initial render time (ms)
- Memory usage (`usedJSHeapSize` in Chromium)
- Per benchmark case timeout: `60000 ms` (timeout cases are recorded in results instead of failing the run)

Quick result highlights (from the latest run):

- At **10k lines**, `react-virtualized-diff` keeps ~**60 FPS**, with **187.2 ms** initial render and **9.5 MB** memory.
- At **50k/100k lines**, `react-diff-viewer` and `react-diff-viewer-continued` hit timeout, while this project finishes both cases.
- At **100k lines**, this project uses **141.1 MB** memory vs `react-diff-view` at **1297.0 MB** (~9.2x lower), and keeps **60.4 FPS** vs **5.6 FPS**.

Run:

```bash
pnpm install
pnpm benchmark
```

> If Playwright Chromium is missing, the script will auto-run `pnpm exec playwright install chromium` once.

> `react-diff-viewer-continued` is optional in the benchmark app. If missing locally, benchmark falls back to `react-diff-viewer` for that case.

Output files:

- `benchmark-results/results.json`
- `benchmark-results/results.md`

➡️ See detailed benchmark table: [benchmark-results/results.md](./benchmark-results/results.md)

## Monorepo structure

```text
apps/demo/       # Vite demo app
packages/react/  # npm package: react-virtualized-diff
```

---

## Local development

```bash
pnpm install
pnpm dev       # run demo app
pnpm build     # build workspace packages
```

---

## npm package README support

To ensure npm users always see correct documentation:

- Package-level README is maintained at `packages/react/README.md`
- `packages/react/package.json` includes README in publish files
- Root README links to the package docs and Chinese docs

---

## Release log

See [CHANGELOG.md](./CHANGELOG.md) for tracked releases and supported capabilities.

---

## Future plan

### Near-term roadmap

- [ ] Optional syntax highlighting (performance-aware)
- [ ] More comprehensive live demo scenarios (big files, mixed edits)
- [ ] Public hosted demo site for quick evaluation
- [ ] Better customization hooks (line renderers, gutters)

### Additional TODOs to make this project more popular

- [ ] Detailed benchmark report vs common diff viewers
- [ ] Keyboard navigation + accessibility improvements
- [ ] Dark/light theme presets and design tokens
- [ ] SSR usage guide (Next.js / Remix examples)
- [ ] More real-world examples (JSON, logs, markdown, code)
- [ ] CI release automation + semantic versioning workflow
- [ ] Contribution guide and issue templates
- [ ] International docs beyond English/Chinese

---

## License

MIT
