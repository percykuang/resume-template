import { useEffect } from 'react';

/**
 * 点击 drawer 外部时关闭 drawer
 */
export function useClickOutside(isOpen: boolean, onClose: () => void) {
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const drawerElement = document.querySelector('.ant-drawer-content');
			const toggleButton = document.querySelector('[data-drawer-toggle]');

			if (
				drawerElement &&
				!drawerElement.contains(target) &&
				toggleButton &&
				!toggleButton.contains(target)
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
