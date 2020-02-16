const crypto = require('crypto');
import * as promisify from 'util.promisify';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';



export const randomBytes = promisify(crypto.randomBytes);

export const signJwt = promisify(jwt.sign)

const RSA_PRIVATE_KEY = fs.readFileSync('./demos/private.key');

const RSA_PUBLIC_KEY = fs.readFileSync('./demos/public.key');

const SESSION_DURATION = 240;


export async function createSessionToken(userId: string) {
  return signJwt({}, RSA_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: SESSION_DURATION,
    subject: userId
  });
}

export async function decodeJwt(token: string) {
  const payload = await jwt.verify(token, RSA_PUBLIC_KEY);

  console.log('decoded JWT payload', payload);

  return payload;
}
