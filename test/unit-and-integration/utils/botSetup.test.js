import { Collection } from 'discord.js';

import { getCommands } from '../../../src/utils/setup';
import { makeMockCommand } from '../../testHelpers';

import Commands from '../../../src/commands';

describe('Bot Setup Utilities', () => {
	describe('`getCommands`', () => {
		const commandCollection = getCommands();

		test('should be a Discord Collection', () => {
			expect(commandCollection).toBeInstanceOf(Collection);
		});

		test('should contain all commands', () => {
			expect(
				Commands.every(Command =>
					commandCollection.has(Command.name.toLocaleLowerCase())
				)
			).toBe(true);
		});

		test('should set aliases', () => {
			const TestCommand = makeMockCommand({
				name: 'Test',
				aliases: ['test-alias'],
			});
			const commands = getCommands([TestCommand]);

			expect(commands.has('test')).toBe(true);
			expect(commands.has('test-alias')).toBe(true);
		});
	});
});
