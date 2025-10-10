import { useEffect, useRef, useState } from 'react';

import { DoubleLeftOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, theme } from 'antd';

import styles from '@/App.module.less';
import ResumeDrawer, { DRAWER_WIDTH } from '@/components/resume-drawer';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { INITIAL_RESUME_SCHEMA } from '@/data';
import type { ResumeSchema } from '@/types/resume';
import { generateResume } from '@/utils/generateResume';

function App() {
	const [resumeData, setResumeData] = useState<ResumeSchema>(
		INITIAL_RESUME_SCHEMA
	);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);

	const handleExport = async () => {
		if (previewRef.current) {
			await generateResume(resumeData, previewRef.current);
		}
	};

	// 根据窗口宽度决定是否需要偏移预览区
	useEffect(() => {
		const updateShift = () => {
			const windowWidth = window.innerWidth;
			// 当窗口宽度小于一定值时才需要偏移
			const needsShift = drawerOpen && windowWidth < 1800;

			if (needsShift) {
				document.documentElement.style.setProperty(
					'--drawer-width',
					`${DRAWER_WIDTH}px`
				);
			} else {
				document.documentElement.style.setProperty('--drawer-width', '0px');
			}
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
					<ResumeForm data={resumeData} onChange={setResumeData} />
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
