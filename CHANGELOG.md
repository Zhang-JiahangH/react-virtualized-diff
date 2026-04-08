# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [0.1.5] - 2026-04-08

### Added

- Added a migration-friendly compatibility layer for `react-diff-viewer` style props:
  - `oldValue` / `newValue` aliases for `original` / `modified`
  - `splitView` toggle for side-by-side vs unified rendering
  - `showDiffOnly` + `extraLinesSurroundingDiff` mapped to collapse behavior
- Added unified (inline) diff rendering mode in addition to split view.
- Added `renderContent(line)` slot for custom syntax highlighting (e.g. Prism/Shiki integrations).
- Added line interaction features:
  - `onLineNumberClick` callbacks with stable line ids (`L-12`, `R-8`)
  - `highlightLines` support including ranges
  - `hideLineNumbers` support for compact embedded layouts
- Added optional code fold message customization via `codeFoldMessageRenderer`.
- Added imperative handle method `resetCodeBlocks()` for external fold reset.

### Changed

- Improved inline replacement visualization with word-level highlights and `disableWordDiff` control.
- Expanded diff strategy selection through `compareMethod` (`CHARS`, `WORDS`, `WORDS_WITH_SPACE`, `LINES`, `TRIMMED_LINES`, `SENTENCES`, `CSS`).
- Upgraded styling/theming extensibility with `styles` overrides and `useDarkTheme`.
- Added review-style headers via `leftTitle` / `rightTitle` and line-number offset support via `linesOffset`.
- Bumped workspace package versions from `0.1.4` to `0.1.5` for this release.


## [0.1.4] - 2026-04-07

### Added

- Published hosted demo page: https://www.zhangjiahang.com/react-virtualized-diff.

### Changed

- Bumped workspace package versions to `0.1.4` for the release.
- Reworked both English and Chinese README documents with clearer, search-friendly structure.
- Promoted API, benchmark, and demo sections for faster discovery by humans and AI crawlers.

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
