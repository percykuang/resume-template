import type { FC, ReactNode } from 'react';

import { DoubleRightOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';

import styles from './styles.module.less';
import { useClickOutside } from './useClickOutside';
import { useDrawerScrollLock } from './useDrawerScrollLock';

interface ResumeDrawerProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	width?: number;
	extra?: ReactNode;
	children: ReactNode;
}

export const DRAWER_WIDTH = 500; // drawer 的宽度

const Index: FC<ResumeDrawerProps> = ({
	open,
	onClose,
	title = '简历编辑',
	width = DRAWER_WIDTH,
	extra,
	children
}) => {
	// 使用内部的 hooks 处理交互逻辑
	useDrawerScrollLock(open);
	useClickOutside(open, onClose);

	return (
		<Drawer
			title={title}
			placement="right"
			open={open}
			onClose={onClose}
			width={width}
			closable={false}
			mask={false}
			maskClosable={false}
			styles={{
				body: { padding: '4px 24px 4px' }
			}}
			extra={extra}
		>
			<button
				className={styles.toggleBtn}
				onClick={onClose}
				title="收起编辑面板"
				data-drawer-toggle
			>
				<DoubleRightOutlined />
			</button>
			{children}
		</Drawer>
	);
};

export default Index;
