import { Command } from '../../classes'

export default class Help extends Command {
	constructor() {
		super({
			name: 'Help',
			category: 'debug',
			aliases: [],
			description: 'Help menus & support',
			usage: {
				name: 'help',
				args: [
					{
						name: 'command',
						description: 'Get help on how to use a specific command.',
						chainable: false,
					},
					{
						name: 'category',
						description: 'Learn more about commands available under a given category.',
						chainable: false,
					},
				],
			},
		})

		this.messageOutput = ''
	}

	// TODO
	// eslint-disable-next-line no-unused-vars
	buildMainHelpMenu(config, commands, categories) {
		return 'This is the main help menu.'
	}

	buildCommandHelpMenu(config, command, invalidUsage = false) {
		const { description, usage } = command

		const chainableArgs = []
		const nonChainableArgs = []

		usage.args.forEach((arg) => {
			if (arg.chainable) {
				chainableArgs.push(arg.name)
			} else {
				nonChainableArgs.push(arg.name)
			}
		})

		const getArgsUsage = () => {
			let argsUsageOutput = ''

			if (nonChainableArgs.length > 0) {
				argsUsageOutput = argsUsageOutput.concat(
					'`<',
					nonChainableArgs.join('|'),
					'>`',
				)
			}

			if (chainableArgs.length > 0) {
				argsUsageOutput = argsUsageOutput.concat(
					'`(',
					chainableArgs.join(', '),
					')`',
				)
			}

			return argsUsageOutput
		}

		const getDetailedArgsDescription = () => {
			let argsDetailsOutput = ''

			usage.args.forEach((arg, index) => {
				if (arg.description) {
					argsDetailsOutput = argsDetailsOutput.concat(
						index === 0 ? '\n' : '\n\n',
						`\`${arg.name}\``,
						'\n',
						arg.description,
						arg.usage ? `${'\n'.repeat(2)}\`${arg.usage}\`` : '',
					)
				}
			})

			return argsDetailsOutput
		}

		const title = `**${command.name} Command**`
		const commandUsage = `\`${config.commandPrefix}${usage.name}\` ${getArgsUsage()}`

		return [
			invalidUsage
				? `Invalid \`${config.commandPrefix}${this.name}\` usage.`
				: title,
			'',
			description,
			'',
			commandUsage,
			getDetailedArgsDescription(),
		].join('\n')
	}

	// TODO
	buildCategoryHelpMenu() {
		return 'This is the command category help menu'
	}

	preAction({ args, bot }) {
		if (args.length === 1) {
			// !help (no args)
			this.messageOutput = this.buildMainHelpMenu(
				bot.config,
				bot.commands,
				bot.commandCategories,
			)
		} else if (bot.commands.has(args[1])) {
			// !help <command>
			this.messageOutput = this.buildCommandHelpMenu(
				bot.config,
				bot.commands.get(args[1].toLocaleLowerCase()),
			)
		} else if (bot.commandCategories.has(args[1])) {
			// !help <category>
			this.messageOutput = this.buildCategoryHelpMenu(
				bot.config,
				bot.commands.get(args[1].toLocaleLowerCase()),
			)
		} else {
			// !help {invalidUsage}
			this.messageOutput = this.buildCommandHelpMenu(bot.config, this, true)
		}
	}

	action({ message }) {
		message.channel.send(this.messageOutput)
	}
}
