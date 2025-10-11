import { type FC, useCallback } from 'react';

import { Form, Input } from 'antd';

import type { ResumeSchema } from '@/types/resume';

import styles from './styles.module.less';

interface ResumeFormProps {
	data: ResumeSchema;
	onChange: (data: ResumeSchema) => void;
}

const Index: FC<ResumeFormProps> = ({ data, onChange }) => {
	const handleChange = useCallback(
		(field: keyof ResumeSchema, value: string) => {
			onChange({
				...data,
				[field]: value
			});
		},
		[data, onChange]
	);

	return (
		<div className={styles.resumeForm}>
			<div className={styles.formContent}>
				<Form layout="vertical" size="large">
					<Form.Item label="姓名">
						<Input
							value={data.name}
							onChange={(e) => handleChange('name', e.target.value)}
							placeholder="请输入姓名"
						/>
					</Form.Item>

					<Form.Item label="职位">
						<Input
							value={data.position}
							onChange={(e) => handleChange('position', e.target.value)}
							placeholder="请输入职位"
						/>
					</Form.Item>

					<Form.Item label="电话号码">
						<Input
							value={data.phone}
							onChange={(e) => handleChange('phone', e.target.value)}
							placeholder="请输入电话号码"
						/>
					</Form.Item>

					<Form.Item label="邮箱">
						<Input
							type="email"
							value={data.email}
							onChange={(e) => handleChange('email', e.target.value)}
							placeholder="请输入邮箱"
						/>
					</Form.Item>

					<Form.Item label="年龄">
						<Input
							value={data.age}
							onChange={(e) => handleChange('age', e.target.value)}
							placeholder="请输入年龄"
						/>
					</Form.Item>

					<Form.Item label="性别">
						<Input
							value={data.gender}
							onChange={(e) => handleChange('gender', e.target.value)}
							placeholder="请输入性别"
						/>
					</Form.Item>

					<Form.Item label="简历内容 (Markdown)">
						<Input.TextArea
							value={data.content}
							onChange={(e) => handleChange('content', e.target.value)}
							placeholder="请输入简历内容，支持 Markdown 格式&#10;&#10;示例：&#10;# 能力概述&#10;- 技能1&#10;- 技能2&#10;&#10;# 项目经历&#10;## 项目名称&#10;### 项目简介&#10;项目描述...&#10;&#10;### 工作内容与成果&#10;- 工作内容1&#10;- 工作内容2"
							rows={20}
							autoSize={{ minRows: 20, maxRows: 30 }}
						/>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Index;
