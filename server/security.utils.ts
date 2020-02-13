import * as promisify from 'util.promisify';
import * as crypto from 'crypto';

export const randomBytes = promisify(crypto.randomBytes);
