# virtualized-diff-viewer

A high-performance React diff viewer built for large files.

---

## ✨ Features

- Side-by-side diff view
- Virtualized rendering for large files
- Collapsed unchanged blocks
- Configurable context lines
- TypeScript support

---

## 📦 Installation

```bash
pnpm add react-virtualized-diff
```

---

## 🚀 Usage

```tsx
import { DiffViewer } from 'react-virtualized-diff';

function Example() {
  return (
    <DiffViewer
      original={oldText}
      modified={newText}
      contextLines={2}
      height={500}
    />
  );
}
```

---

## 🧠 Why this project?

Most React diff viewers work well for small files but struggle with large inputs.

This project focuses on:

- Rendering large diffs efficiently
- Reducing unnecessary DOM nodes
- Keeping interaction smooth even with 100k+ lines

---

## 🛠 Development

```bash
pnpm install
pnpm dev
pnpm build
```

---

## 📊 Roadmap

- [ ] Syntax highlighting (optional, performance-aware)
- [ ] Custom render hooks
- [ ] Worker-based diff computation
- [ ] Benchmark suite

---

## 📄 License

MIT License
