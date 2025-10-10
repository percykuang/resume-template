import { useEffect } from 'react';

/**
 * 根据鼠标位置控制 body 滚动
 * 当鼠标在 drawer 上时禁用 body 滚动,防止滚动穿透
 */
export function useDrawerScrollLock(drawerOpen: boolean) {
	useEffect(() => {
		if (!drawerOpen) return;

		const handleMouseEnter = () => {
			// 鼠标进入 drawer,禁用 body 滚动
			document.body.style.overflow = 'hidden';
		};

		const handleMouseLeave = () => {
			// 鼠标离开 drawer,恢复 body 滚动
			document.body.style.overflow = '';
		};

		const drawerElement = document.querySelector('.ant-drawer-content');
		if (drawerElement) {
			drawerElement.addEventListener('mouseenter', handleMouseEnter);
			drawerElement.addEventListener('mouseleave', handleMouseLeave);
		}

		return () => {
			if (drawerElement) {
				drawerElement.removeEventListener('mouseenter', handleMouseEnter);
				drawerElement.removeEventListener('mouseleave', handleMouseLeave);
			}
			// 清理时恢复 body 滚动
			document.body.style.overflow = '';
		};
	}, [drawerOpen]);
}
