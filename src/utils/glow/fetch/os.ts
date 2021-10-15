import type * as Glow from './glow.js';

/** Stricter typings for the `os` module. */

/** The operating system CPU architecture for which the Node.js binary was compiled. */
export type Arch = 'arm' | 'arm64' | 'ia32' | 'mips' | 'mipsel' | 'ppc' | 'ppc64' | 's390' | 's390x' | 'x32' | 'x64';

/** String identifying the operating system platform. */
export type Platform = 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32' | 'android';

export interface Kind {
	arch: Glow.Arch | string;
	os: Glow.Os | string;
}

/** Unix-ish OSs. */
export type Unixes = 'freebsd' | 'linux' | 'openbsd';
