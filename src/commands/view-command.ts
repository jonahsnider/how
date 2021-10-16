import fs from 'node:fs/promises';
import path from 'node:path';
import {URL} from 'node:url';
import {Command, Option} from 'clipanion';
import {CommandError} from '../utils/errors.js';
import * as Glow from '../utils/glow/index.js';
import * as Tldr from '../utils/tldr.js';

class MissingCommandError extends CommandError {
	constructor(message: string) {
		super(message, false);
		this.name = 'MissingCommandError';
	}
}

export class ViewCommand extends Command {
	static paths = [Command.Default, ['view']];

	// eslint-disable-next-line new-cap
	static usage = Command.Usage({
		description: 'Learn how to use a CLI app.',
		examples: [
			['Basic command', '$0 tar'],
			['Space-delimited command', '$0 git status'],
			['Slugified command', '$0 git-status'],
		],
	});

	readonly command = Option.String();
	// eslint-disable-next-line new-cap
	readonly subCommand = Option.Rest();

	async execute() {
		const app = [this.command, ...this.subCommand].join('-') || 'how';

		let rawMarkdown: Tldr.RawMarkdown;

		const preparations: Array<Promise<void>> = [Glow.prepare()];

		if (app === 'how') {
			rawMarkdown = (await fs.readFile(new URL(path.join('..', '..', 'docs', 'how.md'), import.meta.url), 'utf-8')) as Tldr.RawMarkdown;
		} else {
			const tldrPrepare = Tldr.prepare();
			preparations.push(tldrPrepare);
			await tldrPrepare;

			const rawTldr = await Tldr.read(app);

			if (rawTldr === null) {
				throw new MissingCommandError("That command doesn't exist in the knowledge base (try running `how refresh`)");
			}

			rawMarkdown = rawTldr;
		}

		await Promise.all(preparations);

		const formattedTldr: Tldr.FormattedMarkdown = Tldr.format(rawMarkdown);

		const rawGlow = await Glow.render(formattedTldr);

		const formattedGlow = Glow.format(rawGlow);

		this.context.stdout.write(formattedGlow);
	}
}
