import { makeCommandFromModule } from '../../utils/commands'

import Ping from './Ping'
import Help from './Help'

export default [Ping, Help].map(module => makeCommandFromModule(module))
