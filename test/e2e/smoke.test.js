import waitForExpect from 'wait-for-expect';

import { Bot } from '../../src/classes';
import { MockLogger } from '../testHelpers';
import { getCommands } from '../../src/utils/setup';

jest.setTimeout(10000); // In case of slow network connection, or other unpredictable circumstances

/**
 * @summary
 *
 * This test checks that the bot can (at a bare minimum) log in and connect to a server
 *
 * This test depends on...
 *
 * - A Discord application for the bot already existing
 * - The bot being invited into a test server
 * - Environment variables set up in CI & locally via a .env.test file
 * -- These environment variables are as follows:
 *
 *   @var TOKEN: Discord application auth token for a test bot
 *   @var GUILD_ID: ID of the test server the bot is connected to
 *   @var TEST_CHANNEL_ID: ID of a channel in the test server to test command usage in
 */

describe('Smoke tests', () => {
	const config = {
		statusMessage: 'test',
		statusMessageOptions: {
			type: 'WATCHING',
			url: '',
		},
	};

	const Yggis = new Bot({
		config,
		logger: MockLogger,
		commands: getCommands(),
	});

	/**
	 * Start up & connect the bot before the tests are executed
	 * Disconnect the bot after the tests run, as part of clean up
	 *
	 * For reference, here are the status codes that we can check to see if the bot connects properly
	 *
	 * =={ Status codes }==
	 * 0: READY
	 * 1: CONNECTING
	 * 2: RECONNECTING
	 * 3: IDLE
	 * 4: NEARLY
	 * 5: DISCONNECTED
	 *
	 * @ref https://discord.js.org/#/docs/main/stable/typedef/Status
	 */
	beforeAll(async () => {
		if (Yggis.client.status !== 0) {
			Yggis.start();
		}
		await waitForExpect(() => {
			expect(Yggis.client.status).toBe(0);
		});
	});

	afterAll(async () => {
		await Yggis.client.destroy();
		await waitForExpect(() => {
			expect(Yggis.client.status).toBe(5);
		});
	});

	test('bot should log in successfully', () => {
		expect(Yggis.client.status).toBe(0);
		expect(Yggis.client.guilds.has(process.env.GUILD_ID)).toBe(true);
	});

	test('bot should have the given status message', () => {
		expect(Yggis.client.user.presence).toMatchObject({
			status: 'online',
			game: expect.objectContaining({
				name: config.statusMessage,
				type: 3, // WATCHING
			}),
		});
	});

	test('commands should function', async () => {
		const clearedUp = [false, false];
		const botLogSpy = jest.spyOn(Yggis.logger.bot, 'log');
		const pingCommandLogSpy = jest.spyOn(Yggis.logger.debug, 'log');
		const commandToTry = `${Yggis.commandPrefix}ping`;
		const channelToTestIn = Yggis.client.channels.get(
			process.env.TEST_CHANNEL_ID
		);

		Yggis.client.on('message', message => {
			if (/Pong!/.test(message.content)) {
				message.delete().then(() => {
					clearedUp[1] = true;
				});
			}
		});

		channelToTestIn.send(commandToTry).then(message => {
			message
				.delete()
				.then(() => {
					clearedUp[0] = true;
				})
				.catch(errorDeletingCommand => {
					throw new Error(errorDeletingCommand);
				});
		});

		await waitForExpect(() => {
			expect(botLogSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					message: expect.stringContaining(
						`Message received: "${commandToTry}"`
					),
				})
			);

			expect(pingCommandLogSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					message: expect.stringContaining('has used the `Ping` command!'),
				})
			);

			expect(clearedUp).toStrictEqual([true, true]);
		});
	});
});
