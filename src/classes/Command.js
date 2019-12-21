import noop from 'lodash/noop'

import { MissingPropertyError, InvalidPropertyError } from '../utils/errors'
import { canUseCommand } from '../utils/commands'

export default class Command {
	constructor(options = {}) {
		/* Default options if not provided */
		Object.assign(this, {
			category: 'misc',
			aliases: [],
			disabled: false,
			permLevel: 0,
			description: '',
			usage: { name: '', args: [] },
		}, options)

		/* Command properties to verify */
		this.validateOptions()
	}

	validateOptions() {
		if (!this.name) {
			throw new MissingPropertyError('name')
		}

		if (
			typeof this.permLevel !== 'number'
			|| !(this.permLevel >= 0 && this.permLevel <= 5)
		) {
			throw new InvalidPropertyError('permLevel', 'Not an integer in range (0, 5)')
		}
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
		bot, client, message, args, logger,
	}) {
		if (this.disabled) {
			return null
		}

		if (!canUseCommand(message.member, this.permLevel)) {
			return message.reply('You do not have the required permissions to use this command. 😥')
		}

		await this.preAction({
			bot, client, message, args, logger,
		})
		await this.action({
			bot, client, message, args, logger,
		})
		await this.postAction({
			bot, client, message, args, logger,
		})
	}
}
