import { Collection } from 'discord.js';

import DefaultCommands from '../../commands';

import { makeCommand } from '../commands';

/**
 * @func getCommands
 * @returns {Discord.Collection} CommandCollection
 * @desc Turns an array of `Yggis.Command`s into a `Discord.Collection` of usable `Command`s
 */
export default function getCommands(
	customCommands = [],
	{ includeDefaults } = { includeDefaults: true }
) {
	const CommandCollection = new Collection();
	const commands = customCommands.concat(
		includeDefaults ? DefaultCommands : []
	);

	commands.forEach(command => {
		const { Name, CommandConstructor } = makeCommand(command);
		const CommandToAdd = new CommandConstructor();

		CommandCollection.set(Name.toLocaleLowerCase(), CommandToAdd);

		CommandToAdd.aliases.forEach(alias => {
			CommandCollection.set(alias.toLocaleLowerCase(), CommandToAdd);
		});
	});

	return CommandCollection;
}
