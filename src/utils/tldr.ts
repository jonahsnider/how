import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathExists} from 'path-exists';
import {execa} from 'execa';
import type {Opaque} from 'type-fest';
import convert from 'convert';
import {TLDR_PATH} from '../paths.js';
import {flushOptions, options} from '../options.js';

export type RawMarkdown = Opaque<string, 'RawMarkdown'>;
export type FormattedMarkdown = Opaque<string, 'FormattedMarkdown'>;

const MAX_AGE_BEFORE_REFRESH = convert(7, 'days').to('ms');

const categories = new Set(['common', 'linux']);

switch (os.platform()) {
	case 'darwin':
		categories.add('osx');
		break;
	case 'cygwin':
	case 'win32':
		categories.add('windows');
		break;
	case 'sunos':
		categories.add('sunos');
		break;
	case 'android':
		categories.add('android');
		break;
	default:
		break;
}

async function exists(): Promise<boolean> {
	return pathExists(TLDR_PATH);
}

async function download(): Promise<void> {
	await fs.mkdir(TLDR_PATH, {recursive: true});

	await execa('git', ['clone', 'https://github.com/tldr-pages/tldr.git', TLDR_PATH]);

	options.lastRefresh = Date.now();

	await flushOptions(options);
}

export async function refresh(): Promise<void> {
	await execa('git', ['pull'], {cwd: TLDR_PATH});

	options.lastRefresh = Date.now();

	await flushOptions(options);
}

export async function prepare(): Promise<void> {
	if (await exists()) {
		if (Date.now() - options.lastRefresh > MAX_AGE_BEFORE_REFRESH) {
			return refresh();
		}
	} else {
		return download();
	}
}

export async function read(command: string): Promise<RawMarkdown | null> {
	for (const category of categories) {
		const potentialPath = path.join(TLDR_PATH, 'pages', category, `${command}.md`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const contents = (await fs.readFile(potentialPath, 'utf-8')) as RawMarkdown;

			return contents;
		} catch {
			continue;
		}
	}

	return null;
}

const EXAMPLES = /^`(.*)`/gm;
const EXAMPLE_HEADINGS = /^- (.*)/gm;
const DOUBLE_BRACKETS = /{{|}}/g;

export function format(tldr: RawMarkdown): FormattedMarkdown {
	return tldr
		.replaceAll(
			EXAMPLES,
			`\`\`\`sh
$1
\`\`\``,
		)
		.replaceAll(EXAMPLE_HEADINGS, '## $1')
		.replaceAll(DOUBLE_BRACKETS, '') as FormattedMarkdown;
}
