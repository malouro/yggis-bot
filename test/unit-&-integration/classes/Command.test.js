import { Command } from '../../../src/classes'
import { MissingPropertyError, InvalidPropertyError } from '../../../src/utils/errors'
import { runCommand } from '../../testHelpers'

describe('Command Class', () => {
	class TestCommand extends Command {
		constructor() {
			super({ name: 'test' })
		}
		/* eslint-disable lines-between-class-members */
		preAction = jest.fn(() => 'preAction')
		action = jest.fn(() => 'action')
		postAction = jest.fn(() => 'postAction')
	}

	test('constructs a Command (given a set of options)', () => {
		const testOptions = {
			name: 'test',
		}

		expect(() => new Command(testOptions)).not.toThrowError()

		const testCommand = new Command(testOptions)

		expect(testCommand).toBeInstanceOf(Command)
		expect(testCommand.name).toBe(testOptions.name)
	})

	describe('Actions', () => {
		test('executes `preAction`, `action`, and `postAction` events by default', async () => {
			const testCommand = new Command({ name: 'test' })

			const spyOnPreAction = jest.spyOn(testCommand, 'preAction')
			const spyOnAction = jest.spyOn(testCommand, 'action')
			const spyOnPostAction = jest.spyOn(testCommand, 'postAction')

			await runCommand(testCommand)

			expect(spyOnPreAction).toHaveBeenCalled()
			expect(spyOnAction).toHaveBeenCalled()
			expect(spyOnPostAction).toHaveBeenCalled()
		})

		test('fires a given custom `preAction` event', async () => {
			const testCommand = new TestCommand()

			await runCommand(testCommand)
			expect(testCommand.preAction).toHaveReturnedWith('preAction')
		})


		test('fires a given `postAction` event', async () => {
			const testCommand = new TestCommand()

			await runCommand(testCommand)
			expect(testCommand.postAction).toHaveReturnedWith('postAction')
		})

		test('fires a given `action` event', async () => {
			const testCommand = new TestCommand()

			await runCommand(testCommand)
			expect(testCommand.action).toHaveReturnedWith('action')
		})
	})

	describe('Command options', () => {
		test('is disabled when `disabled = true`', async () => {
			class DisabledCommand extends Command {
				constructor() {
					super({ name: 'test', disabled: true })
				}

				action = jest.fn()
			}

			const testCommand = new DisabledCommand()

			await runCommand(testCommand)
			expect(testCommand.action).not.toHaveBeenCalled()
		})

		test('is usable when user permission level exceeds command requirement', async () => {
			class ZeroPermLevelCommand extends Command {
				constructor() {
					super({
						name: 'test',
						permLevel: 0,
					})
				}

				action = jest.fn()
			}

			const testCommand = new ZeroPermLevelCommand()

			// Set up message object to have minimal possible permission level
			const mockMessage = {
				reply: jest.fn(message => message),
				member: {
					id: 'just a n00b',
					guild: {
						owner: { id: 'not a n00b' },
					},
					hasPermission: () => false,
				},
			}

			await runCommand(testCommand, { message: mockMessage })
			expect(testCommand.action).toHaveBeenCalled()
		})
	})

	describe('Error handling', () => {
		test('throws an error when a `name` isn\'t given', () => {
			expect(
				() => new Command(),
			).toThrowError(new MissingPropertyError('name'))
		})

		test('fails when given a permission level out of expected range', () => {
			const expectedError = new InvalidPropertyError('permLevel', 'Not an integer in range (0, 5)')

			expect(
				() => new Command({ name: 'test', permLevel: -1 }),
			).toThrowError(expectedError)
			expect(
				() => new Command({ name: 'test', permLevel: 6 }),
			).toThrowError(expectedError)
		})
	})
})
