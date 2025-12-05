import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';

const ITERATIONS = 150000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export function hashPassword(password: string): string {
  if (!password) {
    throw new Error('Password is required');
  }

  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `pbkdf2:${DIGEST}:${ITERATIONS}:${salt}:${derived.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored.startsWith('pbkdf2:')) {
    return false;
  }

  const [, digest, iterationStr, salt, hashHex] = stored.split(':');
  const iterations = Number(iterationStr);
  if (!salt || !hashHex || !iterations) {
    return false;
  }

  const derived = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, digest);
  const expected = Buffer.from(hashHex, 'hex');
  const actual = derived;

  return (
    expected.length === actual.length &&
    timingSafeEqual(expected, actual)
  );
}
