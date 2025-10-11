import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import type { ResumeSchema } from '@/types/resume';

// A4 纸尺寸常量 (mm)
const A4_WIDTH = 210;
const A4_HEIGHT = 297;

// A4 纸尺寸常量 (px) - 使用像素单位以确保跨浏览器一致性
// 计算公式：像素 = (毫米 ÷ 25.4) × 96 DPI
// 宽度：(210mm ÷ 25.4) × 96 = 793.7 ≈ 794px
// 高度：(297mm ÷ 25.4) × 96 = 1122.5 ≈ 1123px
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// 导出配置
const EXPORT_CONFIG = {
	scale: 2, // 提高分辨率
	padding: '40px 50px',
	backgroundColor: '#ffffff'
} as const;

/**
 * 等待所有图片加载完成
 */
async function waitForImages(element: HTMLElement): Promise<void> {
	const images = Array.from(element.querySelectorAll('img'));
	const imagePromises = images.map(
		(img) =>
			new Promise<void>((resolve) => {
				if (img.complete) {
					resolve();
				} else {
					img.onload = () => resolve();
					img.onerror = () => resolve(); // 即使加载失败也继续
				}
			})
	);

	await Promise.all(imagePromises);
}

/**
 * 等待所有资源加载完成
 */
async function waitForResources(element: HTMLElement): Promise<void> {
	// 等待所有图片加载
	await waitForImages(element);

	// 等待字体加载
	if (document.fonts && document.fonts.ready) {
		await document.fonts.ready;
	}

	// 额外等待一点时间确保渲染完成
	await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * 创建隔离的渲染容器
 */
function createIsolatedContainer(): HTMLDivElement {
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.left = '-99999px';
	container.style.top = '0';
	container.style.width = `${A4_WIDTH_PX}px`;
	container.style.zIndex = '-1';
	container.style.overflow = 'visible';
	// 强制容器使用标准渲染，避免移动端自动调整字体大小
	container.style.setProperty('-webkit-text-size-adjust', '100%');
	container.style.setProperty('text-size-adjust', '100%');
	return container;
}

/**
 * 配置克隆元素的样式
 */
function configureClonedElement(element: HTMLElement): void {
	element.style.position = 'relative';
	element.style.width = `${A4_WIDTH_PX}px`;
	element.style.minHeight = `${A4_HEIGHT_PX}px`;
	element.style.padding = EXPORT_CONFIG.padding;
	element.style.backgroundColor = EXPORT_CONFIG.backgroundColor;
	element.style.boxSizing = 'border-box';
	// 强制使用标准 DPI，忽略设备像素比
	element.style.transform = 'scale(1)';
	element.style.transformOrigin = 'top left';
	// 关键：强制使用固定的字体渲染，避免移动端字体大小调整
	element.style.setProperty('-webkit-text-size-adjust', '100%');
	element.style.setProperty('text-size-adjust', '100%');
	// 防止内容溢出
	element.style.overflow = 'visible';
	element.style.maxWidth = `${A4_WIDTH_PX}px`;
	element.style.margin = '0';
}

/**
 * 使用 html2canvas 将元素转换为 Canvas
 */
async function elementToCanvas(
	element: HTMLElement
): Promise<HTMLCanvasElement> {
	const contentHeight = element.scrollHeight;

	return await html2canvas(element, {
		scale: EXPORT_CONFIG.scale,
		useCORS: true,
		logging: false,
		backgroundColor: EXPORT_CONFIG.backgroundColor,
		width: A4_WIDTH_PX,
		height: contentHeight,
		windowWidth: A4_WIDTH_PX,
		windowHeight: contentHeight,
		// 确保在所有浏览器中使用一致的渲染行为
		foreignObjectRendering: false,
		// 移除 SVG 相关问题
		removeContainer: true,
		// 关键：在移动设备上忽略设备像素比
		onclone: (clonedDoc) => {
			const clonedBody = clonedDoc.body;
			// 重置可能影响渲染的样式
			clonedBody.style.margin = '0';
			clonedBody.style.padding = '0';
		}
	});
}

/**
 * 将 Canvas 分页添加到 PDF
 */
function addCanvasToPDF(pdf: jsPDF, canvas: HTMLCanvasElement): void {
	const imgWidth = A4_WIDTH;
	const imgHeight = (canvas.height * A4_WIDTH) / canvas.width;
	const totalPages = Math.ceil(imgHeight / A4_HEIGHT);
	const imgData = canvas.toDataURL('image/png');

	for (let i = 0; i < totalPages; i++) {
		if (i > 0) {
			pdf.addPage();
		}

		// 计算当前页需要截取的图片位置
		const offsetY = -i * A4_HEIGHT;
		pdf.addImage(imgData, 'PNG', 0, offsetY, imgWidth, imgHeight);
	}
}

/**
 * 生成 PDF 文件名
 */
function generateFileName(resumeData: ResumeSchema): string {
	const fileNameParts: string[] = [
		resumeData.position,
		resumeData.name,
		resumeData.phone
	].filter((part): part is string => Boolean(part));

	return fileNameParts.length > 0
		? `${fileNameParts.join('-')}.pdf`
		: '简历.pdf';
}

export async function generateResume(
	resumeData: ResumeSchema,
	element: HTMLElement
): Promise<void> {
	let container: HTMLDivElement | null = null;

	try {
		// 1. 创建隔离的渲染容器
		container = createIsolatedContainer();
		document.body.appendChild(container);

		// 2. 克隆并配置元素
		const clonedElement = element.cloneNode(true) as HTMLElement;
		configureClonedElement(clonedElement);
		container.appendChild(clonedElement);

		// 3. 等待所有资源加载完成
		await waitForResources(clonedElement);

		// 4. 将元素转换为 Canvas
		const canvas = await elementToCanvas(clonedElement);

		// 5. 清理 DOM
		if (container && document.body.contains(container)) {
			document.body.removeChild(container);
		}
		container = null;

		// 6. 创建 PDF 并添加内容
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		});

		addCanvasToPDF(pdf, canvas);

		// 7. 保存 PDF
		const fileName = generateFileName(resumeData);
		pdf.save(fileName);
	} catch (error) {
		// 清理容器
		if (container && document.body.contains(container)) {
			document.body.removeChild(container);
		}

		console.error('生成简历失败:', error);
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		throw new Error(`生成简历失败: ${errorMessage}`);
	}
}
