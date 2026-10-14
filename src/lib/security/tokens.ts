// Cryptographically secure tracking token generation & hashing

/**
 * Generates an unguessable, non-sequential tracking token
 * Format: BB-TRK-XXXX-XXXX-XXXX
 */
export function generateTrackingToken(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Base32 crockford avoiding 0/O, 1/I confusion
  const array = new Uint8Array(12);
  window.crypto.getRandomValues(array);

  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += chars[array[i] % chars.length];
  }

  return `BB-${str.slice(0, 4)}-${str.slice(4, 8)}-${str.slice(8, 12)}`;
}

/**
 * Computes a standard SHA-256 hex digest for secure token storage
 */
export async function hashTrackingToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token.trim().toUpperCase());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
