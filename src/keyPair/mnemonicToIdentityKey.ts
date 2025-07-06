import { HDFromSeedOptions, HDKey } from 'dashhd'
import mnemonicToWallet from './mnemonicToWallet'
import walletToIdentityKey from './walletToIdentityKey'
import { WalletToIdentityKeyOpts } from '../types'

export default async function mnemonicToIdentityKey (mnemonic: string, identityIndex: number | undefined = 0, keyIndex: number | undefined = 0, salt?: string, verify?: boolean, opts?: HDFromSeedOptions & WalletToIdentityKeyOpts): Promise<HDKey> {
  const wallet = await mnemonicToWallet(mnemonic, salt, verify, opts)

  return await walletToIdentityKey(wallet, identityIndex, keyIndex, opts)
}
