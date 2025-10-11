import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import type { ResumeSchema } from '@/types/resume';

export async function generateResume(
	resumeData: ResumeSchema,
	element: HTMLElement
): Promise<void> {
	try {
		// 克隆元素，避免影响页面显示
		const clonedElement = element.cloneNode(true) as HTMLElement;

		// 设置克隆元素的样式：固定 A4 尺寸
		clonedElement.style.position = 'absolute';
		clonedElement.style.left = '-9999px';
		clonedElement.style.width = '21cm';
		clonedElement.style.minHeight = '29.7cm';
		clonedElement.style.padding = '40px 50px';
		clonedElement.style.backgroundColor = '#ffffff';

		// 添加到 body
		document.body.appendChild(clonedElement);

		// 使用 html2canvas 将克隆的元素转换为 canvas
		const canvas = await html2canvas(clonedElement, {
			scale: 2, // 提高分辨率
			useCORS: true,
			logging: false,
			backgroundColor: '#ffffff'
		});

		// 移除克隆的元素
		document.body.removeChild(clonedElement);

		// A4 纸尺寸 (mm)
		const pageWidth = 210;
		const pageHeight = 297;

		// 计算图片在 PDF 中的宽度和高度
		const imgWidth = pageWidth;
		const imgHeight = (canvas.height * pageWidth) / canvas.width;

		// 计算需要多少页
		const totalPages = Math.ceil(imgHeight / pageHeight);

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
			const offsetY = -i * pageHeight;

			pdf.addImage(imgData, 'PNG', 0, offsetY, imgWidth, imgHeight);
		}

		// 生成文件名：职位-姓名-手机号
		const fileNameParts = [
			resumeData.position,
			resumeData.name,
			resumeData.phone
		].filter(Boolean); // 过滤掉空值

		const fileName =
			fileNameParts.length > 0 ? `${fileNameParts.join('-')}.pdf` : '简历.pdf';

		pdf.save(fileName);
	} catch (error) {
		console.error('生成简历失败:', error);
		alert('生成简历失败,请重试');
	}
}
