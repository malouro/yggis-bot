import { Collection } from 'discord.js'

import { getCommands } from '../../../src/utils/setup'

import Commands from '../../../src/commands'

describe('Bot Setup Utilities', () => {
	describe('`getCommands` function', () => {
		const commandCollection = getCommands()

		test('should be a Discord Collection', () => {
			expect(commandCollection).toBeInstanceOf(Collection)
		})

		test('should contain all commands', () => {
			expect(
				Commands.every(Command =>
					commandCollection.has(Command.Name.toLocaleLowerCase())),
			).toBe(true)
		})
	})
})
