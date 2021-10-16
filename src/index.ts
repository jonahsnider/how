#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {URL} from 'node:url';
import {Builtins, Cli} from 'clipanion';
import updateNotifier from 'update-notifier';
import * as Commands from './commands/index.js';

const args = process.argv.slice(2);

const pkg = JSON.parse(await fs.readFile(new URL(path.join('..', 'package.json'), import.meta.url), 'utf-8')) as updateNotifier.Package;

updateNotifier({pkg}).notify();

const cli = new Cli({
	binaryLabel: 'how',
	binaryName: 'how',
	binaryVersion: pkg.version,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
for (const Command of Object.values(Commands)) {
	cli.register(Command);
}

cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);

await cli.runExit(args);
