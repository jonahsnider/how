const examples = /^`(.*)`/gm;
const exampleHeadings = /^- (.*)/gm;
const doubleBrackets = /{{|}}/g;

export function formatTldr(tldr: string): string {
	return tldr
		.replaceAll(
			examples,
			`\`\`\`sh
$1
\`\`\``,
		)
		.replaceAll(exampleHeadings, '## $1')
		.replaceAll(doubleBrackets, '');
}

const leadingWhitespace = /^\s+/gim;
export function formatGlow(markdown: string): string {
	return markdown.replaceAll(leadingWhitespace, '');
}
