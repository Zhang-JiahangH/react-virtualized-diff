# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [0.1.3] - 2026-04-07

### Added

- Added a runnable benchmark suite under `apps/benchmark` to compare:
  - `react-virtualized-diff`
  - `react-diff-viewer`
  - `react-diff-viewer-continued`
  - `react-diff-view`
- Added benchmark dimensions for `1k / 10k / 50k / 100k` lines and collected metrics:
  - FPS
  - initial render time
  - memory usage (`performance.memory.usedJSHeapSize` in Chromium)
- Added root benchmark command: `pnpm benchmark`.
- Added automated benchmark runner script: `scripts/run-benchmark.mjs`.

### Improved

- Auto-installs Playwright Chromium on first benchmark run when browser binaries are missing.
- Uses per-case timeout handling (`60000ms`) and records timeout cases in result outputs instead of failing the whole benchmark run.
- Cleanly stops benchmark dev server after execution to avoid noisy exit errors.

### Output

- Benchmark results are generated to:
  - `benchmark-results/results.json`
  - `benchmark-results/results.md`

## [0.1.1] - 2026-04-06

### Added

- Side-by-side diff rendering for text content
- Virtualized rendering via `react-virtuoso` for large files
- Context-line based collapsed unchanged sections
- TypeScript package exports for ESM/CJS + typings
- Demo app using Vite + React

### Docs

- Comprehensive root README (English)
- Chinese README (`README.zh-CN.md`)
- Package-level README for npm consumers (`packages/react/README.md`)
- Roadmap and broader TODO plan for project growth

## [0.1.0] - 2026-04-06

### Added

- Initial public package structure
- Core diff viewer component foundation
