import execa from 'execa';
import fs from 'fs/promises';
import {homedir} from 'os';
import path from 'path';
import {stdout} from 'process';
import {format} from './format.js';

const tldrPath = path.join(homedir(), '.cache', 'how', 'tldr');

try {
	await fs.access(tldrPath);
} catch (error) {
	await fs.mkdir(tldrPath, {recursive: true});
	await execa(`git`, ['clone', 'https://github.com/tldr-pages/tldr.git', tldrPath]);
}

if (Math.random() > 0.95) {
	try {
		await execa(`git`, ['pull'], {cwd: tldrPath});
		console.error('you got unlucky and the cache was refreshed');
	} catch (error) {
		console.error('failed to refresh cache');
	}
}

const command = process.argv[process.argv.length - 1];

// Command was probably a path (ex. '/home/jonah/programming/how/tsc_output')
if (command.includes(path.sep)) {
	console.error('no program');
	process.exit(1);
}

const potentialPaths = ['common', 'linux'].map(dir => path.join(tldrPath, 'pages', dir, `${command}.md`));

for (const potentialPath of potentialPaths) {
	try {
		await fs.access(potentialPath);
	} catch {
		continue;
	}

	const contents = await fs.readFile(potentialPath, 'utf-8');
	const formatted = format(contents);

	const tldr = await execa('./lib/glow-1.3.0', ['-s', 'dark', '-'], {
		input: formatted
	});

	stdout.write(format(tldr.stdout));
	process.exit(0);
}

console.error('no');
process.exit(1);
