import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	js.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		languageOptions: { globals: globals.browser }
	},
	...tseslint.configs.recommended,
	{
		...pluginReact.configs.flat.recommended,
		settings: {
			react: {
				version: 'detect'
			}
		}
	},
	{
		...prettierConfig,
		plugins: {
			prettier: prettierPlugin
		},
		rules: {
			// 将 Prettier 格式问题设为 ESLint 错误（可选：设为 "warn" 仅警告）
			'prettier/prettier': 'error'
		}
	},
	{
		files: ['**/*.{jsx,tsx}'],
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-no-target-blank': 'off'
		}
	}
]);
