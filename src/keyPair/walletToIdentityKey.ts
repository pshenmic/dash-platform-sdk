import { HDKey, HDWallet } from 'dashhd'
import derivePath from './derivePath'
import { WalletToIdentityKeyOpts } from '../types'

/** Returns identity key from wallet
 *
 * @param {HDWallet | HDKey} wallet - wallet that will be used
 * @param {number} identityIndex - index of identity for wallet
 * @param {number} keyIndex - index of key for identity
 * @param {WalletToIdentityKeyOpts} [opts]
 * @return {Promise<HDKey>}
 */
export default async function walletToIdentityKey (wallet: HDWallet | HDKey, identityIndex: number, keyIndex: number, opts?: WalletToIdentityKeyOpts): Promise<HDKey> {
  const network = opts?.network ?? 'testnet'

  const networkIndex = network === 'mainnet' ? 5 : 1

  const pathPostfix = `/5'/0'/0'/${identityIndex}'/${keyIndex}'`

  return await derivePath(wallet, `m/9'/${networkIndex}'${pathPostfix}`)
}
