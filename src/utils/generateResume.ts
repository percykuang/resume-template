import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import type { ResumeSchema } from '@/types/resume';

// A4 纸尺寸常量 (mm)
const A4_WIDTH = 210;
const A4_HEIGHT = 297;

// A4 纸尺寸常量 (cm)
const A4_WIDTH_CM = '21cm';
const A4_HEIGHT_CM = '29.7cm';

// 导出配置
const EXPORT_CONFIG = {
	scale: 2, // 提高分辨率
	padding: '40px 50px',
	backgroundColor: '#ffffff'
} as const;

export async function generateResume(
	resumeData: ResumeSchema,
	element: HTMLElement
): Promise<void> {
	let clonedElement: HTMLElement | null = null;

	try {
		// 克隆元素，避免影响页面显示
		clonedElement = element.cloneNode(true) as HTMLElement;

		// 设置克隆元素的样式：固定 A4 尺寸
		clonedElement.style.position = 'absolute';
		clonedElement.style.left = '-9999px';
		clonedElement.style.width = A4_WIDTH_CM;
		clonedElement.style.minHeight = A4_HEIGHT_CM;
		clonedElement.style.padding = EXPORT_CONFIG.padding;
		clonedElement.style.backgroundColor = EXPORT_CONFIG.backgroundColor;

		// 添加到 body
		document.body.appendChild(clonedElement);

		// 使用 html2canvas 将克隆的元素转换为 canvas
		const canvas = await html2canvas(clonedElement, {
			scale: EXPORT_CONFIG.scale,
			useCORS: true,
			logging: false,
			backgroundColor: EXPORT_CONFIG.backgroundColor
		});

		// 移除克隆的元素
		document.body.removeChild(clonedElement);
		clonedElement = null;

		// 计算图片在 PDF 中的宽度和高度
		const imgWidth = A4_WIDTH;
		const imgHeight = (canvas.height * A4_WIDTH) / canvas.width;

		// 计算需要多少页
		const totalPages = Math.ceil(imgHeight / A4_HEIGHT);

		// 创建 PDF
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		});

		const imgData = canvas.toDataURL('image/png');

		// 分页处理
		for (let i = 0; i < totalPages; i++) {
			if (i > 0) {
				pdf.addPage();
			}

			// 计算当前页需要截取的图片位置
			const offsetY = -i * A4_HEIGHT;

			pdf.addImage(imgData, 'PNG', 0, offsetY, imgWidth, imgHeight);
		}

		// 生成文件名：职位-姓名-手机号
		const fileNameParts: string[] = [
			resumeData.position,
			resumeData.name,
			resumeData.phone
		].filter((part): part is string => Boolean(part));

		const fileName =
			fileNameParts.length > 0 ? `${fileNameParts.join('-')}.pdf` : '简历.pdf';

		pdf.save(fileName);
	} catch (error) {
		// 清理克隆的元素
		if (clonedElement && document.body.contains(clonedElement)) {
			document.body.removeChild(clonedElement);
		}

		console.error('生成简历失败:', error);
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		throw new Error(`生成简历失败: ${errorMessage}`);
	}
}
