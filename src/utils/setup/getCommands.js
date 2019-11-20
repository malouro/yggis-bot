import { Collection } from 'discord.js'

import Commands from '../../commands'

/**
 * @func getCommands
 * @returns {Discord.Collection} CommandCollection
 * @desc Turns an array of `Yggis.Command`s into a `Discord.Collection` of usable `Command`s
 */
export default function getCommands() {
	const CommandCollection = new Collection()

	Commands.forEach((command) => {
		const { Name, CommandConstructor } = command
		const CommandToAdd = new CommandConstructor()

		CommandCollection.set(Name.toLocaleLowerCase(), CommandToAdd)

		CommandToAdd.aliases.forEach((alias) => {
			CommandCollection.set(alias.toLocaleLowerCase(), CommandToAdd)
		})
	})

	return CommandCollection
}
