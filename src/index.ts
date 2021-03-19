#!/usr/bin/env node
import execa from 'execa';
import fs from 'fs/promises';
import path from 'path';
import {stdout} from 'process';
import updateNotifier from 'update-notifier';
import {getOsKind, resolveVersion, updateGlow} from './fetch-glow.js';
import {format} from './format.js';
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
		await updateGlow(version);

		console.log('downloaded a new binary for Glow (makes Markdown pretty)');
	} catch (error) {
		console.error('failed to download a new binary for Glow (makes Markdown pretty)');
		process.exit(1);
	}
}

if (Math.random() > 0.95) {
	try {
		await execa('git', ['pull'], {cwd: tldrPath});
		console.log('you got unlucky and the cache for the Markdown database was refreshed');
	} catch (error) {
		console.error('failed to refresh the cache for the Markdown database');
	}
}

const command = process.argv[process.argv.length - 1];
const potentialPaths = ['common', 'linux'].map(dir => path.join(tldrPath, 'pages', dir, `${command}.md`));

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
	const formatted = format(contents);

	const tldr = await execa(glowPath, ['-s', 'dark', '-'], {
		input: formatted
	});

	stdout.write(format(tldr.stdout));
	process.exit(0);
}

console.error('no');
process.exit(1);
