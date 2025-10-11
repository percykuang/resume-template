import { useEffect, useRef } from 'react';

/**
 * 根据鼠标位置控制 body 滚动
 * 当鼠标在 drawer 上时禁用 body 滚动,防止滚动穿透
 */
export function useDrawerScrollLock(drawerOpen: boolean) {
	const drawerRef = useRef<Element | null>(null);

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

		// 缓存 DOM 元素引用
		drawerRef.current = document.querySelector('.ant-drawer-content');

		if (drawerRef.current) {
			drawerRef.current.addEventListener('mouseenter', handleMouseEnter);
			drawerRef.current.addEventListener('mouseleave', handleMouseLeave);
		}

		return () => {
			if (drawerRef.current) {
				drawerRef.current.removeEventListener('mouseenter', handleMouseEnter);
				drawerRef.current.removeEventListener('mouseleave', handleMouseLeave);
			}
			// 清理时恢复 body 滚动
			document.body.style.overflow = '';
		};
	}, [drawerOpen]);
}
