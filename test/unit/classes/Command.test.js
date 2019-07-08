import Command from '../../../src/classes/Command'

describe('Command Class', () => {
	test('should construct a command given options', () => {
		const testOptions = {
			name: 'test',
		}

		expect(() => new Command(testOptions)).not.toThrowError()

		const testCommand = new Command(testOptions)

		expect(testCommand).toBeInstanceOf(Command)
		expect(testCommand.name).toBe(testOptions.name)
	})

	test.todo('should complain about insufficient command permissions')
	test.todo('should disable when `disabled = true`')
	test.todo('should fire a given `preAction` event')
	test.todo('should fire a given `postAction` event')
	test.todo('should fire a given `action` event')
})
