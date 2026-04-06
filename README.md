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
