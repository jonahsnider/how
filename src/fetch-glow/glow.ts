import type {desiredGlowVersion} from '../options.js';
import type {Unixes} from './os.js';

export type Os = 'Darwin' | 'freebsd' | 'linux' | 'openbsd' | 'Windows';
export type Arch = 'arm64' | 'armv6' | 'armv7' | 'i386' | 'x86_64';
/** A type representing the name of a Glow binary asset from GitHub. */
export type BinaryArchive = `glow_${typeof desiredGlowVersion}_${`${'Darwin_x86_64' | `${Unixes}_${Arch}`}.tar.gz` | `Windows_${'i386' | 'x86_64'}.zip`}`;
