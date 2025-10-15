import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import {
	CalendarOutlined,
	MailOutlined,
	ManOutlined,
	PhoneOutlined
} from '@ant-design/icons';
import MarkdownIt from 'markdown-it';

import { A4_HEIGHT_PX } from '@/constants';
import type { ResumeSchema } from '@/types/resume';

import styles from './styles.module.less';

interface ResumePreviewProps {
	data: ResumeSchema;
}

const md = new MarkdownIt();

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
	({ data }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const [pageBreaks, setPageBreaks] = useState<number[]>([]);

		// 使用 useMemo 缓存 markdown 渲染结果，避免不必要的重新渲染
		const htmlContent = useMemo(() => {
			// 将 markdown 转换为 HTML
			return md.render(data.content || '');
		}, [data.content]);

		// 计算分页位置
		useEffect(() => {
			const calculatePageBreaks = () => {
				if (!containerRef.current) return;

				const containerHeight = containerRef.current.scrollHeight;
				const breaks: number[] = [];

				// 计算需要多少页
				const pageCount = Math.ceil(containerHeight / A4_HEIGHT_PX);

				// 生成分页线位置（从第2页开始），但不超过实际内容高度
				for (let i = 1; i < pageCount; i++) {
					const breakPosition = i * A4_HEIGHT_PX;
					// 只添加在内容范围内的分页线
					if (breakPosition < containerHeight) {
						breaks.push(breakPosition);
					}
				}

				setPageBreaks(breaks);
			};

			// 初次计算
			calculatePageBreaks();

			// 监听内容变化
			const resizeObserver = new ResizeObserver(calculatePageBreaks);
			if (containerRef.current) {
				resizeObserver.observe(containerRef.current);
			}

			return () => {
				resizeObserver.disconnect();
			};
		}, [htmlContent]);

		return (
			<div
				ref={(node) => {
					// 同时处理外部 ref 和内部 ref
					if (typeof ref === 'function') {
						ref(node);
					} else if (ref) {
						ref.current = node;
					}
					containerRef.current = node;
				}}
				className={`${styles.resumePreview} resume-preview`}
			>
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

				{/* 分页指示线 */}
				{pageBreaks.map((top, index) => (
					<div
						key={index}
						className={styles.pageBreak}
						style={{ top: `${top}px` }}
					/>
				))}
			</div>
		);
	}
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
