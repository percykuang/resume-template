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

- **框架**：React 19 + TypeScript
- **构建工具**：Vite 7
- **UI 组件**：Ant Design 5
- **样式**：Less + CSS Modules
- **PDF 生成**：html2canvas + jsPDF
- **Markdown 解析**：markdown-it
- **代码规范**：ESLint + Prettier

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
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 核心功能实现

### PDF 生成

使用 `html2canvas` 将 DOM 转换为 Canvas，再通过 `jsPDF` 生成 PDF 文件。支持多页 PDF 自动分页。

```typescript
// src/utils/generateResume.ts
export async function generateResume(
	resumeData: ResumeSchema,
	element: HTMLElement
): Promise<void>;
```

### Markdown 渲染

使用 `markdown-it` 解析 Markdown 内容，通过 CSS 样式控制各级标题和列表的显示效果。

### 响应式设计

- 当窗口宽度小于 1800px 且抽屉打开时，预览区域会自动向左偏移，避免被抽屉遮挡
- 抽屉可以通过点击外部区域关闭
- 鼠标进入抽屉时自动锁定页面滚动，提升用户体验

## 代码规范

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

## 浏览器兼容性

支持所有现代浏览器：

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## License

MIT
