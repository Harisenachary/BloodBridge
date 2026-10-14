import '@testing-library/jest-dom';

// Polyfill window.crypto.subtle if needed in jsdom
if (!globalThis.crypto) {
  const nodeCrypto = await import('crypto');
  // @ts-ignore
  globalThis.crypto = nodeCrypto.webcrypto;
}
