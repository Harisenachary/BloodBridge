import { describe, it, expect } from 'vitest';
import { generateTrackingToken, hashTrackingToken } from '@/lib/security/tokens';

describe('Cryptographic Security Tokens', () => {
  it('generates non-sequential tokens matching BB-XXXX-XXXX-XXXX pattern', () => {
    const token1 = generateTrackingToken();
    const token2 = generateTrackingToken();

    expect(token1).toMatch(/^BB-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
    expect(token2).toMatch(/^BB-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
    expect(token1).not.toBe(token2);
  });

  it('computes deterministic SHA-256 hash for lookup protection', async () => {
    const token = 'BB-TRK-7A9F-2B4C-8E1D';
    const hash1 = await hashTrackingToken(token);
    const hash2 = await hashTrackingToken(token.toLowerCase()); // Case-insensitive normalized

    expect(hash1).toHaveLength(64); // 256 bits = 64 hex characters
    expect(hash1).toBe(hash2);
  });
});
