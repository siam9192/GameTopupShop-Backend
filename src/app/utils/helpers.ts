import { randomBytes } from 'crypto';

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36); // time-based
  const random = randomBytes(10).toString('hex'); // random part
  return `${random}`.toUpperCase();
}
