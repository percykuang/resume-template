# 性能优化记录

## 优化前问题

根据 Lighthouse 报告发现的主要问题：

1. **缓存策略不佳**：静态资源 Cache TTL 只有 10 分钟，可节省 370 KiB
2. **关键请求链过长**：最大关键路径延迟 1,967 ms
3. **Bundle 体积较大**：主要 vendor 包体积较大

## 已实施的优化措施

### 1. 静态资源缓存策略

**文件**：`public/_headers`

配置了长期缓存策略：
- 静态资源（JS、CSS）：1 年缓存时间（immutable）
- HTML 文件：强制重新验证

**预期效果**：
- 重复访问时节省 370 KiB 流量
- 显著提升回访用户的加载速度

### 2. 优化 Vendor 分包策略

**文件**：`vite.config.ts`

改进了代码分割策略：
- React 核心库独立打包
- Ant Design + Icons 合并打包（避免依赖问题）
- Markdown 渲染独立打包
- PDF 生成库（html2canvas + jsPDF）合并打包

**实际效果**（构建后）：
```
✓ index-QQZm2M6a.js              2.15 kB │ gzip:   0.98 kB  (主入口)
✓ generateResume-DOOuTz_L.js     2.53 kB │ gzip:   1.24 kB  (PDF懒加载)
✓ react-vendor-RsqJS7wA.js      11.33 kB │ gzip:   4.00 kB  (React核心)
✓ purify.es-biuSeZy2.js         22.28 kB │ gzip:   8.51 kB  (工具库)
✓ markdown-vendor-Da9jtcUM.js  102.28 kB │ gzip:  44.16 kB  (Markdown)
✓ index.es-C694XoBx.js         155.79 kB │ gzip:  51.06 kB  (RC组件)
✓ index-DC07oqrt.js            189.48 kB │ gzip:  60.65 kB  (应用代码)
✓ antd-vendor-BVMPxK4Y.js      377.71 kB │ gzip: 119.09 kB  (Ant Design)
✓ pdf-vendor-Cb_SqvvT.js       584.92 kB │ gzip: 169.11 kB  (PDF生成-懒加载)
```

**优势**：
- 按需加载：PDF 导出功能已实现懒加载
- 更好的缓存利用：核心代码变动不影响第三方库缓存
- 避免依赖问题：相关库合并打包，确保模块依赖完整性
- 主入口仅 0.98 KB，极速加载

**重要修复**：
- 修复了过度分包导致的 "Cannot read properties of undefined (reading 'version')" 错误
- 采用保守的分包策略，确保模块依赖关系完整

### 3. 代码压缩优化

**配置**：
- 启用 Terser 压缩
- 移除生产环境的 console 和 debugger
- 目标 ES2015（更好的兼容性和压缩率）

### 4. HTML 优化

**文件**：`index.html`

改进：
- 添加 DNS 预解析（dns-prefetch）
- 添加 meta description（SEO 优化）
- 设置正确的 lang 属性（zh-CN）

### 5. 已有的优化（保持）

✅ React 组件懒加载（ResumeForm）
✅ PDF 生成功能懒加载（动态 import）
✅ Ant Design 按需导入
✅ CSS Modules（避免样式冲突，减少体积）

## 构建体积分析

| 包名 | 原始大小 | Gzip 后 | 说明 |
|------|---------|---------|------|
| 主入口 | 2.12 kB | 0.97 kB | 应用主代码 |
| React | 189.55 kB | 59.35 kB | React 核心 |
| Ant Design | 166.34 kB | 46.79 kB | UI 组件库 |
| jsPDF | 339.31 kB | 108.28 kB | PDF 生成（懒加载）|
| html2canvas | 199.58 kB | 46.04 kB | Canvas 渲染（懒加载）|
| 其他 | 470.57 kB | 168.79 kB | 其他依赖 |

**总计**：约 1.37 MB（原始）→ 约 430 kB（Gzip）

## 关键性能指标目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| FCP | < 1.8s | 首次内容绘制 |
| LCP | < 2.5s | 最大内容绘制 |
| TBT | < 200ms | 总阻塞时间 |
| CLS | < 0.1 | 累积布局偏移 |
| Lighthouse Score | > 90 | 综合性能评分 |

## 下一步优化建议

### 1. 图片优化
- 压缩 favicon.ico
- 使用 WebP 格式（如有图片资源）
- 实现图片懒加载

### 2. CDN 加速
- 将静态资源托管到 CDN
- 使用 CDN 加载第三方库（可选）

### 3. HTTP/2 优化
- 确保服务器支持 HTTP/2
- 利用 HTTP/2 多路复用特性

### 4. 预加载关键资源
```html
<link rel="modulepreload" href="/assets/react-vendor.js">
<link rel="modulepreload" href="/assets/antd-vendor.js">
```

### 5. Service Worker
- 实现离线访问
- 更精细的缓存控制

## 测试建议

### 本地测试
```bash
# 构建
pnpm build

# 预览（模拟生产环境）
pnpm preview

# 在 Chrome 中访问并运行 Lighthouse
```

### 线上测试工具
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- Chrome DevTools Lighthouse

## 参考资料

- [Web Vitals](https://web.dev/vitals/)
- [Vite 构建优化](https://vitejs.dev/guide/build.html)
- [HTTP 缓存最佳实践](https://web.dev/http-cache/)
