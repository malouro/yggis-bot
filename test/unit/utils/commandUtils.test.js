import {
	getArgumentsFromMessage,
	// getCommandFromMessage,
	// makeCommandFromModule,
} from '../../../src/utils/commands'

describe('Command Utilities', () => {
	describe('`getArgumentsFromMessage`', () => {
		test('gets arguments from a message', () => {
			const expectedLength = 6
			const result = getArgumentsFromMessage({
				content: `This message should have ${6} arguments.`,
			})

			expect(result).toBeInstanceOf(Array)
			expect(result).toHaveLength(expectedLength)
			expect(result).toMatchSnapshot()
		})

		test('returns empty array when message is empty or undefined', () => {
			const resultForEmptyMessage = getArgumentsFromMessage({ content: '' })
			const resultForNoMessage = getArgumentsFromMessage(undefined)

			expect(resultForEmptyMessage).toBeInstanceOf(Array)
			expect(resultForEmptyMessage).toHaveLength(0)

			expect(resultForNoMessage).toBeInstanceOf(Array)
			expect(resultForNoMessage).toHaveLength(0)
		})
	})
})
