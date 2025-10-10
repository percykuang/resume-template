type Markdown = string;

interface ResumeSchema {
	name: string;
	title: string;
	phone: string;
	email: string;
	content: Markdown;
}

export function generateResume(schema: ResumeSchema) {
	console.log(schema);
}
