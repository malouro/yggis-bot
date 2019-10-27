import { toMatchDiffSnapshot } from 'snapshot-diff'
import lfgGamesData from '../../../../src/constants/games'

const gameValues = Object.values(lfgGamesData)
const gameKeys = Object.keys(lfgGamesData)
const allGameAliases = gameValues
	.reduce((acc, game) => acc.concat(game.aliases), [])
	.sort()

expect.extend({ toMatchDiffSnapshot })

describe('LFG Games', () => {
	test('every game should meet bare minimum required fields', () => {
		gameValues.forEach((game) => {
			expect(game).toMatchObject({
				name: expect.any(String),
				defaultGameMode: expect.any(String),
			})
		})
	})

	test('aliases are unique across games', () => {
		expect(Array.from(new Set(allGameAliases))).toMatchDiffSnapshot(allGameAliases)
	})

	test('aliases should be unique to game keys', () => {
		expect(allGameAliases.some(alias => gameKeys.includes(alias))).toBe(false)
	})

	test.each(
		[...gameValues],
	)(
		'%s\'s default game mode should be in its `gameModes` config or be "any"',
		(game) => {
			expect(
				game.defaultGameMode === 'any'
				|| (game.gameModes && game.defaultGameMode in game.gameModes)
				|| false,
			).toBe(true)
		},
	)

	test.todo('every game needs an image?')
})
