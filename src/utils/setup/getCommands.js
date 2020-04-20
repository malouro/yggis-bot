import { Collection } from 'discord.js';

import DefaultCommands from '../../commands';

/**
 * @func getCommands
 * @returns {Discord.Collection} CommandCollection
 * @desc Turns an array of `Yggis.Command`s into a `Discord.Collection` of usable `Command`s
 */
export default function getCommands(
	customCommands = [],
	{ includeDefaults, t } = { includeDefaults: true, t: null }
) {
	const CommandCollection = new Collection();
	const commands = customCommands.concat(
		includeDefaults ? DefaultCommands : []
	);

	commands.forEach(CommandConstructor => {
		const CommandToAdd = t
			? new CommandConstructor({ t })
			: new CommandConstructor();

		CommandCollection.set(CommandToAdd.name.toLocaleLowerCase(), CommandToAdd);

		CommandToAdd.aliases.forEach(alias => {
			CommandCollection.set(alias.toLocaleLowerCase(), CommandToAdd);
		});
	});

	return CommandCollection;
}
