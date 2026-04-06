# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [0.1.2] - 2026-04-06

### Added

- Added `release-please` workflow to automatically create version/changelog release PRs from conventional commits
- Added release manifest/config to keep package versioning source-of-truth in repository metadata

### Changed

- Updated publish workflow to validate git tag version against `packages/react/package.json` before npm publish
- Release flow now supports automated patch/minor bumps without manually editing workflow version values

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
