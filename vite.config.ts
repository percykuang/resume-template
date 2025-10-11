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
					// Ant Design 组件库单独打包
					'antd-vendor': ['antd', '@ant-design/icons'],
					// Markdown 渲染库单独打包
					'markdown-vendor': ['markdown-it'],
					// PDF 生成相关的重型库单独打包
					'pdf-vendor': ['html2canvas', 'jspdf']
				}
			}
		},
		// 提高 chunk 大小警告阈值，避免不必要的警告
		chunkSizeWarningLimit: 600
	}
});
