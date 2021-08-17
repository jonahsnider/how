#!/usr/bin/env node
import {Stopwatch} from '@jonahsnider/util';
import {convert} from 'convert';
import execa from 'execa';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import {stdout} from 'process';
import updateNotifier from 'update-notifier';
import {getOsKind, resolveVersion, updateGlow} from './fetch-glow.js';
import {formatTldr, formatGlow} from './format.js';
import {desiredGlowVersion, options} from './options.js';
import {glowPath, tldrPath, __dirname} from './paths.js';

updateNotifier({pkg: JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf-8'))}).notify();

try {
	await fs.access(tldrPath);
} catch (error) {
	await fs.mkdir(tldrPath, {recursive: true});
	await execa('git', ['clone', 'https://github.com/tldr-pages/tldr.git', tldrPath]);
	console.log('downloaded the database of Markdown examples');
}

if (options.glowVersion !== desiredGlowVersion) {
	// Currently installed version is not the same as the desired version

	const osKind = getOsKind();
	const version = resolveVersion(osKind);

	try {
		const stopwatch = Stopwatch.start();
		await updateGlow(version);

		const duration = convert(stopwatch.end(), 'ms').to('s').toFixed(2);

		console.log(`downloaded a new binary for Glow (makes Markdown pretty, took ${duration}s)`);
	} catch (error) {
		console.error('failed to download a new binary for Glow (makes Markdown pretty)', error);
		process.exit(1);
	}
}

if (Math.random() > 0.95) {
	try {
		const stopwatch = Stopwatch.start();
		await execa('git', ['pull'], {cwd: tldrPath});
		const duration = convert(stopwatch.end(), 'ms').to('s').toFixed(2);

		console.log(`you got unlucky and the cache for the Markdown database was refreshed (took ${duration}s)`);
	} catch (error) {
		console.error('failed to refresh the cache for the Markdown database', error);
	}
}

const command = process.argv[process.argv.length - 1];
const categories = ['common', 'linux'];

switch (os.platform()) {
	case 'darwin':
		categories.unshift('osx');
		break;
	case 'cygwin':
	case 'win32':
		categories.unshift('windows');
		break;
	case 'sunos':
		console.log('how are you even running node on sunos???');
		categories.unshift('sunos');
		break;
	case 'android':
		categories.unshift('android');
		break;
	default:
		break;
}

const potentialPaths = categories.map(dir => path.join(tldrPath, 'pages', dir, `${command}.md`));

if (
	// Command was probably a path (ex. '/home/jonah/programming/how/tsc_output')
	command.includes(path.sep) ||
	// Command is this program
	command === 'how'
) {
	potentialPaths.unshift(path.join(__dirname, '..', 'docs', 'how.md'));
}

for (const potentialPath of potentialPaths) {
	try {
		await fs.access(potentialPath);
	} catch {
		continue;
	}

	const contents = await fs.readFile(potentialPath, 'utf-8');
	const formatted = formatTldr(contents);

	const tldr = await execa(glowPath, ['-s', 'dark', '-'], {
		input: formatted,
	});

	stdout.write(formatGlow(tldr.stdout));
	process.exit(0);
}

console.error('no');
process.exit(1);
