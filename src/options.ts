import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathExists} from 'path-exists';
import {CACHE_DIR, OPTIONS_PATH} from './paths.js';

interface OptionsV1 {
	versionNumber: 1;
	/** Currently installed version for glow. */
	glowVersion: string | null;
}

interface OptionsV2 {
	versionNumber: 2;
	/** Currently installed version for glow. */
	glowVersion: string | null;
	/** Timestamp of last refresh. */
	lastRefresh: number;
}

type OptionsLatest = OptionsV2;
type Options = OptionsV1 | OptionsV2;

export {OptionsLatest as Options};

/**
 * The desired version of Glow to download locally.
 * @see https://github.com/charmbracelet/glow/releases
 */
export const DESIRED_GLOW_VERSION = '1.4.1';

export const DEFAULT_OPTIONS: Readonly<OptionsLatest> = {
	versionNumber: 2,
	glowVersion: null,
	lastRefresh: 0,
};

async function exists() {
	return pathExists(OPTIONS_PATH);
}

/**
 * Flush options object to filesystem.
 * @param data - Options to flush
 */
export async function flushOptions(data: OptionsLatest): Promise<void> {
	await fs.writeFile(OPTIONS_PATH, `${JSON.stringify(data, undefined, 2)}${os.EOL}`, 'utf8');
}

async function readOptions(): Promise<OptionsLatest> {
	if (!(await exists())) {
		await fs.mkdir(CACHE_DIR, {recursive: true});
		await flushOptions(DEFAULT_OPTIONS);
	}

	const contents = await fs.readFile(path.join(OPTIONS_PATH), 'utf8');

	const rawOptions = JSON.parse(contents) as Options;

	switch (rawOptions.versionNumber) {
		case 1: {
			const options: OptionsLatest = {...DEFAULT_OPTIONS, ...rawOptions, versionNumber: 2};
			await flushOptions(options);

			return readOptions();
		}

		case 2: {
			return rawOptions;
		}

		default: {
			throw new RangeError(`Unknown options version`);
		}
	}
}

export const options = await readOptions();
