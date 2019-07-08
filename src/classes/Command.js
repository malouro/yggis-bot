import { MissingPropertyError } from '../utils/errors'

function noop() { /** @func noop */ }

function validateCommandProperties(options) {
	if (!options.name) {
		throw new MissingPropertyError('name')
	}
}

export default class Command {
	constructor({
		name,
		aliases,
	} = {}) {
		/* Command properties to verify */
		validateCommandProperties({
			name,
		})

		this.name = name
		this.aliases = aliases || []
	}

	preAction() {
		noop()
	}

	action() {
		noop()
	}

	postAction() {
		noop()
	}

	async run({
		client,
		message,
		logger,
	}) {
		await this.preAction()
		await this.action({ client, message, logger })
		await this.postAction()
	}
}
