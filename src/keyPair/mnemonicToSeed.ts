import { mnemonicToSeed as func } from '@scure/bip39'

// const bip39 = {mnemonicToSeed : (a,b) => Promise.resolve(Uint8Array.from({length: 0}))}

export default async function mnemonicToSeed (mnemonic: string, salt?: string): Promise<Uint8Array> {
  return await func(mnemonic, salt)
}
