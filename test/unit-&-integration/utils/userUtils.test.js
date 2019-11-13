import { getUserPermLevel } from '../../../src/utils/user'
import { MockMember, MockMasterID } from '../../testHelpers'

describe('User Utilities', () => {
	describe('`getUserPermLevel`', () => {
		test('returns a 0 permission level by default', () => {
			expect(getUserPermLevel()).toBe(0)
		})

		test('gets the master user\'s permission level correctly', () => {
			expect(getUserPermLevel({
				...MockMember,
				id: MockMasterID,
			})).toBe(5)
		})

		test('gets the guild owner\'s permission level correctly', () => {
			expect(getUserPermLevel({
				...MockMember,
				guild: { owner: { id: 'OwnerID' } },
				id: 'OwnerID',
			})).toBe(4)
		})

		test('gets an administrator\'s permission level correctly', () => {
			expect(getUserPermLevel({
				...MockMember,
				hasPermission: perm => perm === 'ADMINISTRATOR',
			})).toBe(3)
		})

		test('gets a normal user\'s permission level correctly', () => {
			expect(getUserPermLevel({
				...MockMember,
			})).toBe(0)
		})
	})
})
