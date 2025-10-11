import {
	Suspense,
	lazy,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';

import { DoubleLeftOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Spin, theme } from 'antd';

import { INITIAL_RESUME_SCHEMA } from '@/data';
import type { ResumeSchema } from '@/types/resume';

import { DRAWER_WIDTH, ResumeDrawer, ResumePreview } from './components';
import styles from './styles.module.less';

// 懒加载 ResumeForm 组件，因为只有在打开 drawer 时才需要
const ResumeForm = lazy(() => import('./components/resume-form'));

// 预览区偏移的临界窗口宽度
const SHIFT_BREAKPOINT = 1800;

function App() {
	const [resumeData, setResumeData] = useState<ResumeSchema>(
		INITIAL_RESUME_SCHEMA
	);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);

	const handleExport = useCallback(async () => {
		if (!previewRef.current) return;

		try {
			// 动态导入 generateResume，只在需要导出时加载
			const { generateResume } = await import('@/utils/generateResume');
			await generateResume(resumeData, previewRef.current);
		} catch (error) {
			// 这里可以使用 antd 的 message 或 notification 组件
			console.error('导出失败:', error);
			alert(error instanceof Error ? error.message : '生成简历失败，请重试');
		}
	}, [resumeData]);

	// 根据窗口宽度决定是否需要偏移预览区
	useEffect(() => {
		const updateShift = () => {
			const windowWidth = window.innerWidth;
			// 当窗口宽度小于一定值时才需要偏移
			const needsShift = drawerOpen && windowWidth < SHIFT_BREAKPOINT;

			document.documentElement.style.setProperty(
				'--drawer-width',
				needsShift ? `${DRAWER_WIDTH}px` : '0px'
			);
		};

		updateShift();
		window.addEventListener('resize', updateShift);

		return () => {
			window.removeEventListener('resize', updateShift);
			document.documentElement.style.setProperty('--drawer-width', '0px');
		};
	}, [drawerOpen]);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#000'
				},
				algorithm: theme.defaultAlgorithm
			}}
		>
			<div className={styles.app}>
				<div
					className={`${styles.previewPanel} ${drawerOpen ? styles.shifted : ''}`}
				>
					<ResumePreview ref={previewRef} data={resumeData} />
				</div>

				<ResumeDrawer
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					extra={
						<Button
							type="primary"
							icon={<ExportOutlined />}
							onClick={handleExport}
						>
							导出为 PDF
						</Button>
					}
				>
					<Suspense
						fallback={
							<div style={{ textAlign: 'center', padding: '50px' }}>
								<Spin size="large" tip="加载中..." />
							</div>
						}
					>
						<ResumeForm data={resumeData} onChange={setResumeData} />
					</Suspense>
				</ResumeDrawer>

				{!drawerOpen && (
					<button
						className={styles.drawerToggleBtnClosed}
						onClick={() => setDrawerOpen(true)}
						title="展开编辑面板"
					>
						<DoubleLeftOutlined />
					</button>
				)}
			</div>
		</ConfigProvider>
	);
}

export default App;
