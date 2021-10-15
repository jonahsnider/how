import execa from 'execa';
import {pathExists} from 'path-exists';
import type {Opaque} from 'type-fest';
import {DESIRED_GLOW_VERSION, options} from '../../options.js';
import {GLOW_PATH} from '../../paths.js';
import type {FormattedMarkdown} from '../tldr.js';
import {getOsKind, resolveVersion, updateGlow} from './fetch/index.js';

export type RawGlowOutput = Opaque<string, 'RawGlowOutput'>;
export type FormattedGlowOutput = Opaque<string, 'FormattedGlowOutput'>;

const LEADING_WHITESPACE = /^\s+/gim;

async function exists(): Promise<boolean> {
	return pathExists(GLOW_PATH);
}

export async function prepare(): Promise<void> {
	if (!(await exists()) || options.glowVersion !== DESIRED_GLOW_VERSION) {
		// Currently installed version is not the same as the desired version

		const osKind = getOsKind();
		const version = resolveVersion(osKind);

		await updateGlow(version);
	}
}

export async function render(markdown: FormattedMarkdown): Promise<RawGlowOutput> {
	const output = await execa(GLOW_PATH, ['-s', 'dark', '-'], {
		input: markdown,
	});

	return output.stdout as RawGlowOutput;
}

export function format(markdown: RawGlowOutput): FormattedGlowOutput {
	// TODO: Doesn't work because Glow outputs ANSI escape codes
	return markdown.replaceAll(LEADING_WHITESPACE, '') as FormattedGlowOutput;
}
