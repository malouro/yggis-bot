import { Collection } from 'discord.js';
import flatten from 'lodash/flatten';
import { getCommands } from '../../../src/utils/setup';
import { makeMockCommand } from '../../testHelpers';

import Commands from '../../../src/commands';

const Aliases = flatten(
	Commands.map(Command => {
		const cmd = new Command();

		return cmd.aliases;
	})
);

describe('Bot Setup Utilities', () => {
	describe('`getCommands`', () => {
		const [commandCollection, aliasCollection] = getCommands();

		test('should be Discord Collections', () => {
			expect(commandCollection).toBeInstanceOf(Collection);
			expect(aliasCollection).toBeInstanceOf(Collection);
		});

		test('should contain all commands', () => {
			expect(
				Commands.every(Command =>
					commandCollection.has(Command.name.toLocaleLowerCase())
				)
			).toBe(true);
		});

		test('should contain all aliases', () => {
			expect(
				Aliases.every(Alias => aliasCollection.has(Alias.toLocaleLowerCase()))
			).toBe(true);
		});

		test('should set aliases', () => {
			const TestCommand = makeMockCommand({
				name: 'Test',
				aliases: ['test-alias'],
			});
			const [commands, aliases] = getCommands([TestCommand]);

			expect(commands.has('test')).toBe(true);
			expect(aliases.has('test-alias')).toBe(true);
		});
	});
});
