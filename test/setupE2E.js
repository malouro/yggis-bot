import { config } from 'dotenv';
import path from 'path';

if (process.env.CI !== 'true') {
	config({ path: path.resolve(__dirname, '../../.env.test') });
}
