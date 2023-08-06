import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import {pipeline} from 'node:stream/promises';
import path from 'node:path';
import got from 'got';
import decompress from 'decompress';
import {GLOW_PATH} from '../../../paths.js';
import {DESIRED_GLOW_VERSION, flushOptions, options} from '../../../options.js';
import type * as Os from './os.js';
import type * as Glow from './glow.js';

/**
 * Determine which binary for Glow should be installed for the given operating system.
 * @example
 * ```ts
 * resolveVersion({ os: 'Darwin', arch: 'x86_64' }); // 'glow_1.3.0_Darwin_x86_64.tar.gz'
 * ```
 */
export function resolveVersion(host: Os.Kind): Glow.BinaryArchive {
	switch (host.os) {
		case 'Darwin': {
			if (host.arch === 'x86_64') {
				return `glow_${DESIRED_GLOW_VERSION}_Darwin_x86_64.tar.gz` as const;
			}

			break;
		}

		case 'Windows': {
			if (host.arch === 'i386' || host.arch === 'x86_64') {
				return `glow_${DESIRED_GLOW_VERSION}_Windows_${host.arch}.zip` as const;
			}

			break;
		}

		case 'freebsd':
		case 'linux':
		case 'openbsd': {
			switch (host.arch) {
				case 'arm64':
				case 'i386':
				case 'x86_64': {
					return `glow_${DESIRED_GLOW_VERSION}_${host.os}_${host.arch}.tar.gz` as const;
				}

				default: {
					throw new RangeError(`Unsupported architecture: ${host.arch}`);
				}
			}
		}

		default: {
			throw new RangeError(`Unsupported OS: ${host.os}`);
		}
	}

	throw new RangeError('Unexpected combination of architecture and os');
}

/** Mapping of Node.js `os.arch` to architectures targeted by Glow builds. */
enum OsArchToGlowArch {
	/* eslint-disable @typescript-eslint/naming-convention */
	'arm64' = 'arm64',
	'x32' = 'i386',
	'x64' = 'x86_64',
	/* eslint-enable @typescript-eslint/naming-convention */
}

/** Mapping of Node.js `os.platform` to OSs targeteted by Glow builds. */
enum OsPlatformToGlowOs {
	/* eslint-disable @typescript-eslint/naming-convention */
	'darwin' = 'Darwin',
	'freebsd' = 'freebsd',
	'linux' = 'linux',
	'openbsd' = 'openbsd',
	'win32' = 'Windows',
	/* eslint-enable @typescript-eslint/naming-convention */
}

/**
 * Get the Glow compatible architecture and OS for this machine.
 */
export function getOsKind(): Os.Kind {
	const arch = os.arch() as Os.Arch;

	if (!(arch in OsArchToGlowArch)) {
		throw new Error('Unsupported CPU architecture');
	}

	const platform = os.platform() as Os.Platform;

	if (!(platform in OsPlatformToGlowOs)) {
		throw new Error('Unsupported OS platform');
	}

	return {
		arch: OsArchToGlowArch[arch as keyof typeof OsArchToGlowArch],
		os: OsPlatformToGlowOs[platform as keyof typeof OsPlatformToGlowOs],
	};
}

/**
 * Update Glow to the preferred version.
 * @param archiveName - The name of the Glow binary archive to download
 */
export async function updateGlow(archiveName: Glow.BinaryArchive): Promise<void> {
	const url = `https://github.com/charmbracelet/glow/releases/download/v${DESIRED_GLOW_VERSION}/${archiveName}`;

	const archivePath = `${GLOW_PATH}-archive`;
	await pipeline(got.stream(url), fs.createWriteStream(archivePath));

	await decompress(archivePath, path.join(GLOW_PATH, '..'), {
		// Ignore the documentation files in releases
		filter: file => file.path.startsWith('glow'),
	});

	await fsp.unlink(archivePath);

	options.glowVersion = DESIRED_GLOW_VERSION;

	await flushOptions(options);
}
