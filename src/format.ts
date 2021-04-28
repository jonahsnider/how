const examples = /^`(.*)`/gm;
const exampleHeadings = /^- (.*)/gm;
const doubleBrackets = /{{|}}/g;

export function format(tldr: string): string {
	return tldr
		.replaceAll(
			examples,
			`\`\`\`sh
$1
\`\`\``
		)
		.replaceAll(exampleHeadings, '## $1')
		.replaceAll(doubleBrackets, '')
		.trimStart();
}
