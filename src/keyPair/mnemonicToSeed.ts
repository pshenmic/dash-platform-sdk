import * as DashPhrase from 'dashphrase'

export default async function mnemonicToSeed (mnemonic: string, salt?: string, verify?: boolean): Promise<Uint8Array> {
  return DashPhrase.toSeed(mnemonic, salt, { verify })
}
