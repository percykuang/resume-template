# 简历生成器

一个基于 React + TypeScript + Vite 的在线简历生成工具，支持 Markdown 编辑和 PDF 导出。

## 在线访问

🔗 **[https://resume.percy.ren](https://resume.percy.ren)**

## 功能特性

- **实时预览**：左侧实时预览简历效果，右侧编辑个人信息和简历内容
- **Markdown 支持**：使用 Markdown 语法编写简历内容，支持标题、列表等格式
- **PDF 导出**：一键导出为高质量 PDF 文件，文件名自动按照"职位-姓名-手机号"格式命名
- **响应式布局**：支持不同屏幕尺寸，编辑面板可收起/展开
- **优雅交互**：抽屉式编辑面板，支持点击外部关闭，鼠标进入时禁止页面滚动

## 技术栈

- **框架**：React 19 + TypeScript 5.9
- **构建工具**：Vite 7
- **UI 组件**：Ant Design 5
- **样式**：Less + CSS Modules
- **PDF 生成**：html2canvas + jsPDF
- **Markdown 解析**：markdown-it
- **代码规范**：ESLint 9 + Prettier 3
- **Git 工具**：Husky + lint-staged + Commitlint
- **包管理器**：pnpm 10

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173` 即可开始使用。

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 使用说明

### 基本信息

在右侧编辑面板填写以下信息：

- **姓名**：必填项，显示在简历顶部
- **职位**：期望职位或当前职位
- **电话号码**：联系方式
- **邮箱**：电子邮件地址
- **年龄**：年龄信息
- **性别**：性别信息

### Markdown 格式规范

简历内容支持以下 Markdown 语法：

#### 一级标题（h1）

用于大的章节标题，如"能力概述"、"项目经历"

```markdown
# 能力概述

# 项目经历
```

#### 列表（li）

用于能力列表或要点说明

```markdown
- 熟练掌握 HTML、CSS、JavaScript
- 熟悉 React 技术栈
- 掌握构建工具 Webpack 及 Babel
```

#### 二级标题（h2）

用于项目名称或子章节标题

```markdown
## 飞书文档

## UI 组件库、图表库、脚手架、基础库
```

#### 三级标题（h3）

用于项目详情小节，如"项目简介"、"工作内容与成果"

```markdown
### 项目简介

### 工作内容与成果
```

#### 段落（p）

普通文本内容

```markdown
飞书文档是一款新兴文档协同办公工具...
```

### 示例

```markdown
# 能力概述

- 熟练掌握 HTML、CSS、JavaScript、Typescript 以及 AOP、FP 等设计思想
- 熟悉 React 技术栈,了解 React 及相关技术框架的实现原理
- 掌握构建工具 Webpack 及插件工具 Babel,并深入理解其原理

# 项目经历

## 飞书文档

### 项目简介

飞书文档是一款新兴文档协同办公工具,可作为企业知识库、个人笔记工具使用。

### 工作内容与成果

- 参与飞书文档项目整体架构设计,包含技术选型、方案评审与设计
- 优化项目中核心流程交互与性能
- 针对拖拽交互进行专项优化
```

## 导出 PDF

1. 填写完个人信息和简历内容后
2. 点击右侧抽屉顶部的"导出为 PDF"按钮
3. PDF 文件将自动下载，文件名格式为：`职位-姓名-手机号.pdf`
   - 例如：`高级前端工程师-张三-13800138000.pdf`
   - 如果某个字段为空，该字段将不会出现在文件名中

## 项目结构

```
resume-template/
├── .github/                 # GitHub 配置
├── .husky/                  # Git Hooks 配置
├── public/                  # 静态资源
├── src/
│   ├── components/          # 组件目录
│   │   ├── resume-drawer/   # 简历编辑抽屉组件
│   │   │   ├── index.tsx
│   │   │   ├── useClickOutside.ts      # 点击外部关闭 Hook
│   │   │   ├── useDrawerScrollLock.ts  # 抽屉滚动锁定 Hook
│   │   │   └── styles.module.less
│   │   ├── resume-form/     # 简历表单组件
│   │   │   ├── index.tsx
│   │   │   └── styles.module.less
│   │   └── resume-preview/  # 简历预览组件
│   │       ├── index.tsx
│   │       └── styles.module.less
│   ├── data/                # 初始数据
│   ├── styles/              # 全局样式
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   │   └── generateResume.ts       # PDF 生成函数
│   ├── App.tsx              # 主应用组件
│   ├── App.module.less      # 主应用样式
│   └── main.tsx             # 应用入口
├── .editorconfig            # 编辑器配置
├── .gitignore               # Git 忽略文件
├── .npmrc                   # npm 配置
├── .nvmrc                   # Node 版本配置
├── .prettierrc.json         # Prettier 配置
├── commitlint.config.ts     # Commitlint 配置
├── eslint.config.ts         # ESLint 配置
├── index.html               # 入口 HTML
├── package.json             # 项目依赖配置
├── pnpm-lock.yaml           # pnpm 锁文件
├── tsconfig.json            # TypeScript 配置
├── tsconfig.app.json        # 应用 TS 配置
├── tsconfig.node.json       # Node TS 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 项目文档
```

## 核心功能实现

### PDF 生成

使用 `html2canvas` 将 DOM 转换为 Canvas，再通过 `jsPDF` 生成 PDF 文件。支持多页 PDF 自动分页，并针对不同浏览器（特别是 Safari）进行了优化。

核心实现：

```typescript
// src/utils/generateResume.ts
export async function generateResume(
	resumeData: ResumeSchema,
	element: HTMLElement
): Promise<void>;
```

**技术要点：**

- 自动计算页面高度和分页位置
- 针对移动端和 Safari 浏览器优化渲染尺寸
- 智能生成文件名：`职位-姓名-手机号.pdf`
- 支持高清输出（2x scale）

### Markdown 渲染

使用 `markdown-it` 解析 Markdown 内容，通过 CSS 样式控制各级标题和列表的显示效果。

**支持的 Markdown 元素：**

- h1：主要章节标题
- h2：项目名称或子章节
- h3：项目详情小节
- li：列表项
- p：段落文本

### 响应式设计

**桌面端：**

- 当窗口宽度小于 1800px 且抽屉打开时，预览区域会自动向左偏移，避免被抽屉遮挡
- 抽屉可以通过点击外部区域关闭
- 鼠标进入抽屉时自动锁定页面滚动，提升用户体验

**移动端：**

- 优化 PDF 导出尺寸和分页
- 自适应屏幕宽度
- 抽屉式编辑面板

### 自定义 Hooks

项目封装了多个实用的自定义 Hooks：

- `useClickOutside`：检测点击外部区域（src/components/resume-drawer/useClickOutside.ts:1）
- `useDrawerScrollLock`：抽屉打开时锁定页面滚动（src/components/resume-drawer/useDrawerScrollLock.ts:1）

## 代码规范

项目配置了完整的代码规范工具链，包括 ESLint、Prettier、TypeScript 类型检查以及 Git 提交规范。

### 格式化代码

```bash
pnpm format
```

### 检查代码格式

```bash
pnpm format:check
```

### ESLint 检查

```bash
pnpm lint
```

### ESLint 自动修复

```bash
pnpm lint:fix
```

### TypeScript 类型检查

```bash
pnpm type-check
```

### Git Hooks

项目使用 Husky + lint-staged 在提交代码前自动进行代码检查和格式化：

- **pre-commit**：自动对暂存的文件执行 ESLint 修复和 Prettier 格式化
- **commit-msg**：验证提交信息是否符合规范

### 提交信息规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，提交信息格式：

```
<type>: <subject>
```

常用的 type 类型：

- **feat**：新功能
- **fix**：修复 bug
- **docs**：文档更新
- **style**：代码格式调整（不影响代码运行）
- **refactor**：重构代码
- **perf**：性能优化
- **test**：测试相关
- **chore**：构建过程或辅助工具的变动

示例：

```bash
git commit -m "feat: 添加简历模板选择功能"
git commit -m "fix: 修复 PDF 导出在 Safari 浏览器的分页问题"
git commit -m "docs: 更新 README 文档"
```

## 部署

### 部署到 GitHub Pages

项目已配置 GitHub Pages 自动部署脚本：

```bash
pnpm build
pnpm deploy
```

这将构建项目并自动部署到 GitHub Pages。

## 浏览器兼容性

支持所有现代浏览器：

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 开发环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0

## 常见问题

### PDF 导出时分页不正确？

项目已针对不同浏览器（包括 Safari）的 PDF 导出进行优化，确保分页正确。如果仍有问题，请检查：

1. 浏览器版本是否符合兼容性要求
2. 简历内容是否过长导致渲染问题
3. 是否使用了不支持的 Markdown 语法

### 移动端显示异常？

项目已对移动端进行适配，支持响应式布局。编辑面板在小屏幕上会以抽屉形式展示。

### 如何自定义简历样式？

可以修改以下文件来自定义样式：

- `src/components/resume-preview/styles.module.less`：简历预览区域样式
- `src/styles/index.less`：全局样式

### Husky 钩子没有生效？

首次克隆项目后，需要运行以下命令来安装 Git Hooks：

```bash
pnpm install
pnpm prepare
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

提交 PR 前请确保：

1. 代码通过 ESLint 检查：`pnpm lint`
2. 代码格式符合 Prettier 规范：`pnpm format:check`
3. TypeScript 类型检查通过：`pnpm type-check`
4. 提交信息符合 Conventional Commits 规范

## 更新日志

查看最近的提交记录了解项目更新：

- **fix**: 修复 Safari 浏览器导出 PDF 时分页不对的问题
- **chore**: 新增项目基础配置（ESLint、Prettier、Husky）
- **feat**: 配置了 commitlint 和 pre-commit 执行的脚本
- **feat**: 优化了性能和样式
- **fix**: 修复在移动端导出时尺寸和分页不对的问题

## License

MIT

## 作者

Percy - [https://percy.ren](https://percy.ren)
