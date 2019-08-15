import { Command } from '../../../src/classes'
import { MissingPropertyError } from '../../../src/utils/errors'

describe('Command Class', () => {
	class TestCommand extends Command {
		constructor() {
			super({ name: 'test' })
		}

		preAction = jest.fn(() => 'preAction');

		action = jest.fn(() => 'action');

		postAction = jest.fn(() => 'postAction');
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

	test('throws an error when a `name` isn\'t given', () => {
		expect(() => new Command()).toThrowError(new MissingPropertyError('name'))
	})

	test('executes `preAction`, `action`, and `postAction` events by default', async () => {
		const testCommand = new Command({ name: 'test' })

		const spyOnPreAction = jest.spyOn(testCommand, 'preAction')
		const spyOnAction = jest.spyOn(testCommand, 'action')
		const spyOnPostAction = jest.spyOn(testCommand, 'postAction')

		await testCommand.run({ client: {}, message: {}, logger: {} })

		expect(spyOnPreAction).toHaveBeenCalled()
		expect(spyOnAction).toHaveBeenCalled()
		expect(spyOnPostAction).toHaveBeenCalled()
	})

	test('fires a given custom `preAction` event', async () => {
		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.preAction).toHaveReturnedWith('preAction')
	})


	test('fires a given `postAction` event', async () => {
		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.postAction).toHaveReturnedWith('postAction')
	})

	test('fires a given `action` event', async () => {
		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.action).toHaveReturnedWith('action')
	})

	test('disabled when `disabled = true`', async () => {
		class DisabledCommand extends Command {
			constructor() {
				super({ name: 'test', disabled: true })
			}

      action = jest.fn(() => {});
		}

		const testCommand = new DisabledCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.action).not.toHaveBeenCalled()
	})

	test.todo('warns about insufficient command permissions')
})
