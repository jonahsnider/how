import * as fs from 'fs/promises';
import os from 'os';
import path from 'path';
import {cacheDir, optionsPath} from './paths.js';

export interface Options {
	/** Currently installed version for glow. */
	glowVersion: string | null;
	versionNumber: 1;
}

/**
 * The desired version of Glow to download locally.
 * @see https://github.com/charmbracelet/glow/releases
 */
export const desiredGlowVersion = '1.4.1';

export const defaultOptions: Options = {
	glowVersion: null,
	versionNumber: 1,
};

/**
 * Flush options object to filesystem.
 * @param data - Options to flush
 */
export async function flushOptions(data: Options): Promise<void> {
	await fs.writeFile(optionsPath, JSON.stringify(data, undefined, 2) + os.EOL, 'utf-8');
}

try {
	await fs.access(optionsPath);
} catch (error) {
	await fs.mkdir(cacheDir, {recursive: true});
	await flushOptions(defaultOptions);
}

export const options: Options = JSON.parse(await fs.readFile(path.join(optionsPath), 'utf-8'));
