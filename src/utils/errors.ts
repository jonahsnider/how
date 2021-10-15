export class CommandError extends Error {
	constructor(message: string, stack?: boolean) {
		super(message);
		this.name = 'CommandError';

		if (stack === false) {
			this.stack = undefined;
		}
	}
}
