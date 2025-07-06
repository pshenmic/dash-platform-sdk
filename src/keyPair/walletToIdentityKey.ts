import { HDKey, HDWallet } from 'dashhd'
import derivePath from './derivePath'
import { WalletToIdentityKeyOpts } from '../types'

export default async function walletToIdentityKey (wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts?: WalletToIdentityKeyOpts): Promise<HDKey> {
  const network = opts?.network ?? 'testnet'

  const networkIndex = network === 'mainnet' ? 5 : 1

  const pathPostfix = `/5'/0'/0'/${identityIndex}'/${keyIndex}'`

  return await derivePath(wallet, `m/9'/${networkIndex}'${pathPostfix}`)
}
