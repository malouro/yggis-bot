import { Command } from '../../../src/classes'
import { MissingPropertyError } from '../../../src/utils/errors'

describe('Command Class', () => {
	test('constructs a Command (given a set of options)', () => {
		const testOptions = {
			name: 'test',
		}

		expect(() => new Command(testOptions)).not.toThrowError()

		const TestCommand = new Command(testOptions)

		expect(TestCommand).toBeInstanceOf(Command)
		expect(TestCommand.name).toBe(testOptions.name)
	})

	test("throws an error when a `name` isn't given", () => {
		expect(() => new Command()).toThrowError(MissingPropertyError)
	})

	test('executes preAction, action, and postAction events by default', async () => {
		const TestCommand = new Command({ name: 'test' })

		const spyOnPreAction = jest.spyOn(TestCommand, 'preAction')
		const spyOnAction = jest.spyOn(TestCommand, 'action')
		const spyOnPostAction = jest.spyOn(TestCommand, 'postAction')

		await TestCommand.run({ client: {}, message: {}, logger: {} })

		expect(spyOnPreAction).toHaveBeenCalled()
		expect(spyOnAction).toHaveBeenCalled()
		expect(spyOnPostAction).toHaveBeenCalled()
	})

	test('fires a given custom `preAction` event', async () => {
		class TestCommand extends Command {
			constructor() {
				super({ name: 'test' })
			}

      preAction = jest.fn(() => 'preAction');
		}

		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.preAction).toHaveReturnedWith('preAction')
	})

	test('fires a given `postAction` event', async () => {
		class TestCommand extends Command {
			constructor() {
				super({ name: 'test' })
			}

      postAction = jest.fn(() => 'postAction');
		}

		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.postAction).toHaveReturnedWith('postAction')
	})

	test('fires a given `action` event', async () => {
		class TestCommand extends Command {
			constructor() {
				super({ name: 'test' })
			}

      action = jest.fn(() => 'action');
		}

		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.action).toHaveReturnedWith('action')
	})

	test('disabled when `disabled = true`', async () => {
		class TestCommand extends Command {
			constructor() {
				super({ name: 'test', disabled: true })
			}

      action = jest.fn(() => {});
		}

		const testCommand = new TestCommand()
		await testCommand.run({ client: {}, message: {}, logger: {} })
		expect(testCommand.action).not.toHaveBeenCalled()
	})

	test.todo('warns about insufficient command permissions')
})
