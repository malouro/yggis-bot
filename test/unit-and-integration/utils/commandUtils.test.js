import {
	getArgumentsFromMessage,
	getCommandFromMessage,
} from '../../../src/utils/commands';

describe('Command Utilities', () => {
	describe('`getArgumentsFromMessage`', () => {
		test('gets arguments from a message', () => {
			const expectedLength = 6;
			const result = getArgumentsFromMessage({
				content: `This message should have ${expectedLength} arguments.`,
			});

			expect(result).toBeInstanceOf(Array);
			expect(result).toHaveLength(expectedLength);
			expect(result).toMatchSnapshot();
		});

		test('returns empty array when message is empty or undefined', () => {
			const resultForEmptyMessage = getArgumentsFromMessage({ content: '' });
			const resultForNoMessage = getArgumentsFromMessage(undefined);

			expect(resultForEmptyMessage).toBeInstanceOf(Array);
			expect(resultForEmptyMessage).toHaveLength(0);

			expect(resultForNoMessage).toBeInstanceOf(Array);
			expect(resultForNoMessage).toHaveLength(0);
		});
	});

	describe('`getCommandFromMessage`', () => {
		test('gets command from a message', () => {
			const expectation = 'test';
			const testCommandPrefix = '!';
			const result = getCommandFromMessage(
				[
					`${testCommandPrefix}${expectation}`,
					'message',
					'with',
					'multiple',
					'args',
				],
				testCommandPrefix
			);

			expect(result).toBe(expectation);
		});
	});
});
