/**
 * @description Permission level definitions:
 *
 * |===================|
 * | # | Description   |
 * |===================|
 * | 5 | Bot master    |
 * | 4 | Guild owner   |
 * | 3 | Administrator |
 * | 2 | ???           |
 * | 1 | ???           |
 * | 0 | Everyone      |
 * ''''''''''''''''''''
 */

export default function getUserPermLevel(member) {
	if (!member) return 0;
	if (member.id === process.env.MASTER_ID) {
		return 5;
	}
	if (member.guild.owner.id === member.id) {
		return 4;
	}
	if (member.hasPermission('ADMINISTRATOR')) {
		return 3;
	}
	return 0;
}
