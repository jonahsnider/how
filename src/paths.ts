import {homedir} from 'node:os';
import path from 'node:path';

export const cacheDir = path.join(homedir(), '.cache', 'how');
export const optionsPath = path.join(cacheDir, 'options.json');
export const tldrPath = path.join(cacheDir, 'tldr');
export const glowPath = path.join(cacheDir, 'glow');
