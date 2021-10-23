import {Command} from 'clipanion';
import * as Tldr from '../utils/tldr.js';

export class RefreshCommand extends Command {
	static paths = [['refresh'], ['-r']];

	// eslint-disable-next-line new-cap
	static usage = Command.Usage({
		description: 'Refresh the downloaded knowledge base.',
		category: 'Meta',
	});

	async execute() {
		await Tldr.refresh();
	}
}