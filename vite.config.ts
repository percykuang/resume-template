import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	base: '/',
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// React 核心库
					if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
						return 'react-vendor';
					}
					// Ant Design 核心
					if (id.includes('node_modules/antd')) {
						return 'antd-vendor';
					}
					// Ant Design Icons
					if (id.includes('@ant-design/icons')) {
						return 'antd-icons-vendor';
					}
					// Markdown 渲染
					if (id.includes('node_modules/markdown-it')) {
						return 'markdown-vendor';
					}
					// html2canvas
					if (id.includes('node_modules/html2canvas')) {
						return 'html2canvas-vendor';
					}
					// jsPDF
					if (id.includes('node_modules/jspdf')) {
						return 'jspdf-vendor';
					}
					// 其他 node_modules
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				}
			}
		},
		// 提高 chunk 大小警告阈值
		chunkSizeWarningLimit: 600,
		// 启用 CSS 代码分割
		cssCodeSplit: true,
		// 优化依赖预构建
		target: 'es2015',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		}
	}
});
