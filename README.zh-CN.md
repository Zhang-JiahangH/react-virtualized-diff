# virtualized-diff-viewer

一个面向**超大文本文件**场景的高性能 React 差异对比组件（虚拟滚动渲染）。

> npm 包名：**`react-virtualized-diff`**

[English README](./README.md)

---

## 项目定位

很多 diff 组件在小文件场景表现不错，但面对数万行甚至十万行文本时，渲染和交互会明显变慢。

`virtualized-diff-viewer` 的目标是：

- **性能优先**：通过虚拟列表减少 DOM 压力
- **可读性优先**：清晰的左右对比视图
- **可配置性**：支持上下文折叠行数配置
- **工程可用性**：TypeScript 友好、接入简单

---

## 功能特性

- ✅ 左右并排差异视图
- ✅ 虚拟化渲染（适合大文件）
- ✅ 未变化区块折叠 + 上下文行
- ✅ React 项目快速接入
- ✅ 开箱即用 TypeScript 类型定义

---

## 安装

```bash
# pnpm
pnpm add react-virtualized-diff

# npm
npm install react-virtualized-diff

# yarn
yarn add react-virtualized-diff
```

---

## 快速开始

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

## 当前 API

### `DiffViewer` 属性

- `original: string`：原始文本
- `modified: string`：修改后文本
- `contextLines?: number`：变化块周围保留的上下文行数
- `height?: number | string`：组件容器高度（建议固定高度以获得更好性能）

---

## Benchmark（性能基准）

我们提供了可运行的 benchmark，对比以下组件：

- `react-virtualized-diff`（本项目）
- `react-diff-viewer`
- `react-diff-viewer-continued`
- `react-diff-view`

最新结果亮点：

- **10k 行**：本项目保持约 **60 FPS**，首屏渲染 **187.2 ms**，内存 **9.5 MB**。
- **50k / 100k 行**：`react-diff-viewer` 与 `react-diff-viewer-continued` 在 `60000 ms` 超时限制内未完成。
- **100k 行**：本项目内存 **141.1 MB**，而 `react-diff-view` 为 **1297.0 MB**（约 **9.2 倍**差距）；FPS 分别为 **60.4 vs 5.6**。

运行方式：

```bash
pnpm install
pnpm benchmark
```

详细结果请查看：[`benchmark-results/results.md`](./benchmark-results/results.md)

---

## 仓库结构

```text
apps/demo/       # Vite 演示项目
packages/react/  # npm 包：react-virtualized-diff
```

---

## 本地开发

```bash
pnpm install
pnpm dev
pnpm build
```

---

## npm 包 README 支持说明

为确保 npm 页面文档可用：

- 在 `packages/react/README.md` 维护包级说明
- 在 `packages/react/package.json` 发布文件中包含 README
- 根目录 README 与中文文档互相链接

---

## 版本发布记录

详见 [CHANGELOG.md](./CHANGELOG.md)。

---

## 后续规划

### 近期路线

- [ ] 可选语法高亮（性能优先设计）
- [ ] 更完整的在线 Demo 场景（超大文件、复杂编辑）
- [ ] 托管在线示例站点，方便快速体验
- [ ] 更强的自定义能力（行渲染、gutter 等）

### 可提升项目影响力的 TODO

- [ ] 与主流 diff 组件的基准测试报告
- [ ] 键盘导航与无障碍增强
- [ ] 深色/浅色主题预设
- [ ] SSR 集成文档（Next.js / Remix）
- [ ] 更多真实场景示例（JSON、日志、Markdown、代码）
- [ ] CI 自动发布与语义化版本流程
- [ ] 完善贡献指南与 issue 模板
- [ ] 扩展多语言文档

---

## 许可证

MIT
