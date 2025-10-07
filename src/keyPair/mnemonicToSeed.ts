import { mnemonicToSeedSync as func } from '@scure/bip39'

export default function mnemonicToSeed (mnemonic: string, salt?: string): Uint8Array {
  return func(mnemonic, salt)
}
