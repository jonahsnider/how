import {homedir} from 'node:os';
import path from 'node:path';

export const CACHE_DIR = path.join(homedir(), '.cache', 'how');
export const OPTIONS_PATH = path.join(CACHE_DIR, 'options.json');
export const TLDR_PATH = path.join(CACHE_DIR, 'tldr');
export const GLOW_PATH = path.join(CACHE_DIR, 'glow');
