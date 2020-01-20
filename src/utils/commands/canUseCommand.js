import { getUserPermLevel } from '../user';

export default function canUseCommand(user, requiredPermLevel) {
	return getUserPermLevel(user) >= requiredPermLevel;
}
