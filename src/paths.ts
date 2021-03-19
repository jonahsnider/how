import {homedir} from 'os';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const cacheDir = path.join(homedir(), '.cache', 'how');
export const optionsPath = path.join(cacheDir, 'options.json');
export const tldrPath = path.join(cacheDir, 'tldr');
export const glowPath = path.join(cacheDir, 'glow');
