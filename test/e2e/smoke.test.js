import waitForExpect from 'wait-for-expect'

import { Bot } from '../../src/classes'
import { MockLogger } from '../testHelpers'
import { getCommands } from '../../src/utils/setup'

jest.setTimeout(10000) // In case of slow network connection, or other unpredictable circumstances

/**
 * For reference, here are the status codes that we can check to see if the bot connects properly
 *
 * == Status codes: ==
 * 0: READY
 * 1: CONNECTING
 * 2: RECONNECTING
 * 3: IDLE
 * 4: NEARLY
 * 5: DISCONNECTED
 *
 * @ref https://discord.js.org/#/docs/main/stable/typedef/Status
 */

describe('End-to-end environment', () => {
	const config = {
		statusMessage: 'test',
		statusMessageOptions: {
			type: 'WATCHING',
			url: '',
		},
	}

	const Yggis = new Bot({
		config,
		logger: MockLogger,
		commands: getCommands()
	})

	/**
	 * Start up & disconnect the bot before and after each test
	 */
	beforeAll(async () => {
		if (Yggis.client.status !== 0) {
			Yggis.start()
		}

		await waitForExpect(() => {
			expect(Yggis.client.status).toBe(0)
		})
	})
	afterAll(async () => {
		await Yggis.client.destroy()
		await waitForExpect(() => {
			expect(Yggis.client.status).toBe(5)
		})
	})

	test('bot should log in successfully', () => {
		expect(Yggis.client.status).toBe(0)
		expect(Yggis.client.guilds.has(process.env.GUILD_ID)).toBe(true)
	})

	test('bot should have the given status message', () => {
		expect(Yggis.client.user.presence).toMatchObject({
			status: 'online',
			game: expect.objectContaining({
				name: config.statusMessage,
				type: 3 // WATCHING
			}),
		})
	})
})
