import { Collection } from 'discord.js'

import { getCommands } from '../../../src/utils/setup'
import { makeCommandFromModule } from '../../../src/utils/commands'
import { makeMockCommand } from '../../testHelpers'

import Commands from '../../../src/commands'

describe('Bot Setup Utilities', () => {
	describe('`getCommands`', () => {
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

		test('should set aliases', () => {
			const commands = getCommands([
				makeCommandFromModule(
					makeMockCommand({
						name: 'Test',
						aliases: ['test-alias'],
					}),
				),
			])

			expect(commands.has('test')).toBe(true)
			expect(commands.has('test-alias')).toBe(true)
		})
	})
})
