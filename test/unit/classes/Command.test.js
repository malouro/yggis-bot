import Command from '../../../src/classes/Command'
import { MissingPropertyError } from '../../../src/utils/errors'

describe('Command Class', () => {
	test('should throw an error when a `name` isn\'t given', () => {
		expect(() => new Command()).toThrowError(MissingPropertyError)
	})

	test('should construct a command given options', () => {
		const testOptions = {
			name: 'test',
		}

		expect(() => new Command(testOptions)).not.toThrowError()

		const testCommand = new Command(testOptions)

		expect(testCommand).toBeInstanceOf(Command)
		expect(testCommand.name).toBe(testOptions.name)
	})

	test('should fire a preAction, an action, and a postAction', async () => {
		const testCommand = new Command({ name: 'test' })

		const spyOnPreAction = jest.spyOn(testCommand, 'preAction')
		const spyOnAction = jest.spyOn(testCommand, 'action')
		const spyOnPostAction = jest.spyOn(testCommand, 'postAction')

		await testCommand.run({ client: {}, message: {}, logger: {} })

		expect(spyOnPreAction).toHaveBeenCalled()
		expect(spyOnAction).toHaveBeenCalled()
		expect(spyOnPostAction).toHaveBeenCalled()
	})

	test('should fire a given custom `preAction` event', async () => {
		class TestCommand extends Command {
			constructor() {
				super({ name: 'test' })
			}

			preAction = jest.fn(() => 'preAction')
		}

		const testCommand = new TestCommand()

		await testCommand.run({ client: {}, message: {}, logger: {} })

		expect(testCommand.preAction).toHaveBeenCalled()
	})

	test('should fire a given `postAction` event', () => {

	})

	test.todo('should fire a given `action` event')

	test.todo('should complain about insufficient command permissions')
	test.todo('should disable when `disabled = true`')
})
