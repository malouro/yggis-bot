import { Collection } from 'discord.js'
import Commands from '../../commands'

export default function getCommands(client) {
	const CommandCollection = new Collection()

	Commands.forEach((command) => {
		const { Name, CommandConstructor } = command
		const CommandToAdd = new CommandConstructor({ client })

		CommandCollection.set(Name.toLocaleLowerCase(), CommandToAdd)

		CommandToAdd.aliases.forEach((alias) => {
			CommandCollection.set(alias.toLocaleLowerCase(), CommandToAdd)
		})
	})

	return CommandCollection
}
