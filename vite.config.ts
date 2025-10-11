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
				manualChunks: {
					// React 核心库单独打包
					'react-vendor': ['react', 'react-dom'],
					// Ant Design 组件库单独打包（包含 icons）
					'antd-vendor': ['antd', '@ant-design/icons'],
					// Markdown 渲染库单独打包
					'markdown-vendor': ['markdown-it'],
					// PDF 生成相关的重型库单独打包
					'pdf-vendor': ['html2canvas', 'jspdf']
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
