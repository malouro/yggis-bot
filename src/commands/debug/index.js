import { makeCommandFromModule } from '../../utils/commands'

import Ping from './Ping'

export default [
	Ping,
].map(module => makeCommandFromModule(module))
