import decompress from 'decompress';
import fs from 'fs';
import fsp from 'fs/promises';
import got from 'got';
import os from 'os';
import stream from 'stream';
import {promisify} from 'util';
import {desiredGlowVersion, flushOptions, options} from './options.js';
import {glowPath} from './paths.js';
import path from 'path';

const pipeline = promisify(stream.pipeline);

namespace Glow {
	export type Os = 'Darwin' | 'freebsd' | 'linux' | 'openbsd' | 'Windows';
	export type Arch = 'arm64' | 'armv6' | 'armv7' | 'i386' | 'x86_64';
}

/** Unix-ish OSs. */
type Unixes = 'freebsd' | 'linux' | 'openbsd';

/** A type representing the name of a Glow binary asset from GitHub. */
export type GlowBinaryArchive = `glow_${typeof desiredGlowVersion}_${
	| `${'Darwin_x86_64' | `${Unixes}_${Glow.Arch}`}.tar.gz`
	| `Windows_${'i386' | 'x86_64'}.zip`}`;

/** Stricter typings for the `os` module. */
export namespace Os {
	/** The operating system CPU architecture for which the Node.js binary was compiled. */
	export type Arch = 'arm' | 'arm64' | 'ia32' | 'mips' | 'mipsel' | 'ppc' | 'ppc64' | 's390' | 's390x' | 'x32' | 'x64';

	/** String identifying the operating system platform. */
	export type Platform = 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32' | 'android';
}

export interface OsKind {
	arch: Glow.Arch;
	os: Glow.Os;
}

/**
 * Determine which binary for Glow should be installed for the given operating system.
 * @example
 * ```ts
 * resolveVersion({ os: 'Darwin', arch: 'x86_64' }); // 'glow_1.3.0_Darwin_x86_64.tar.gz'
 * ```
 */
export function resolveVersion(host: OsKind): GlowBinaryArchive {
	switch (host.os) {
		case 'Darwin': {
			if (host.arch === 'x86_64') {
				return `glow_${desiredGlowVersion}_Darwin_x86_64.tar.gz` as const;
			}
			break;
		}
		case 'Windows': {
			if (host.arch === 'i386' || host.arch === 'x86_64') {
				return `glow_${desiredGlowVersion}_Windows_${host.arch}.zip` as const;
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
					return `glow_${desiredGlowVersion}_${host.os}_${host.arch}.tar.gz` as const;
				}
			}
			break;
		}
	}

	throw new RangeError('Unexpected combination of architecture and os');
}

/** Mapping of Node.js `os.arch` to architectures targeted by Glow builds. */
enum OsArchToGlowArch {
	'arm64' = 'arm64',
	'x32' = 'i386',
	'x64' = 'x86_64',
}

/** Mapping of Node.js `os.platform` to OSs targeteted by Glow builds. */
enum OsPlatformToGlowOs {
	'darwin' = 'Darwin',
	'freebsd' = 'freebsd',
	'linux' = 'linux',
	'openbsd' = 'openbsd',
	'win32' = 'Windows',
}

/**
 * Get the Glow compatible architecture and OS for this machine.
 */
export function getOsKind(): OsKind {
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
export async function updateGlow(archiveName: GlowBinaryArchive): Promise<void> {
	const url = `https://github.com/charmbracelet/glow/releases/download/v${desiredGlowVersion}/${archiveName}`;

	const archivePath = `${glowPath}-archive`;
	await pipeline(got.stream(url), fs.createWriteStream(archivePath));

	await decompress(archivePath, path.join(glowPath, '..'), {
		// Ignore the documentation files in releases
		filter: file => file.path.startsWith('glow'),
	});

	await fsp.unlink(archivePath);

	options.glowVersion = desiredGlowVersion;

	await flushOptions(options);
}
