import { forwardRef, useMemo } from 'react';

import {
	CalendarOutlined,
	MailOutlined,
	ManOutlined,
	PhoneOutlined
} from '@ant-design/icons';
import MarkdownIt from 'markdown-it';

import type { ResumeSchema } from '@/types/resume';

import styles from './styles.module.less';

interface ResumePreviewProps {
	data: ResumeSchema;
}

const md = new MarkdownIt({
	breaks: true,
	html: true
});

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
	({ data }, ref) => {
		// 使用 useMemo 缓存 markdown 渲染结果，避免不必要的重新渲染
		const htmlContent = useMemo(() => {
			// 将连续的空行转换为 <br/> 标签，用于控制 PDF 分页
			const processedContent = (data.content || '').replace(
				/\n\n\n+/g,
				'\n\n<br/>\n\n'
			);

			// 将 markdown 转换为 HTML
			return md.render(processedContent);
		}, [data.content]);

		return (
			<div ref={ref} className={`${styles.resumePreview} resume-preview`}>
				<div className={styles.header}>
					<div className={styles.nameSection}>
						<h1 className={styles.name}>{data.name || '姓名'}</h1>
						{data.position && (
							<span className={styles.position}>{data.position}</span>
						)}
					</div>
					<div className={styles.contactInfo}>
						{data.phone && (
							<div className={styles.contactItem}>
								<PhoneOutlined className={styles.icon} />
								<span>{data.phone}</span>
							</div>
						)}
						{data.email && (
							<div className={styles.contactItem}>
								<MailOutlined className={styles.icon} />
								<span>{data.email}</span>
							</div>
						)}
						{data.age && (
							<div className={styles.contactItem}>
								<CalendarOutlined className={styles.icon} />
								<span>{data.age}岁</span>
							</div>
						)}
						{data.gender && (
							<div className={styles.contactItem}>
								<ManOutlined className={styles.icon} />
								<span>{data.gender}</span>
							</div>
						)}
					</div>
				</div>

				<div
					className={styles.content}
					dangerouslySetInnerHTML={{ __html: htmlContent }}
				/>
			</div>
		);
	}
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
