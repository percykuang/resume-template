import { useEffect, useRef } from 'react';

/**
 * 点击 drawer 外部时关闭 drawer
 */
export function useClickOutside(isOpen: boolean, onClose: () => void) {
	const drawerRef = useRef<Element | null>(null);
	const toggleRef = useRef<Element | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		// 缓存 DOM 元素引用
		drawerRef.current = document.querySelector('.ant-drawer-content');
		toggleRef.current = document.querySelector('[data-drawer-toggle]');

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;

			if (
				drawerRef.current &&
				!drawerRef.current.contains(target) &&
				toggleRef.current &&
				!toggleRef.current.contains(target)
			) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);
}
