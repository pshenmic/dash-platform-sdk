import { webcrypto } from 'crypto'
// eslint-disable-next-line
if (!globalThis.crypto) {
  // @ts-expect-error
  globalThis.crypto = webcrypto
}
