import { HDKey } from '@scure/bip32'
import mnemonicToSeed from './mnemonicToSeed.js'
import deriveChild from './deriveChild.js'
import derivePath from './derivePath.js'
import { Network } from '../../types.js'
import { p2pkh } from '@scure/btc-signer'
import { OrchardAddressWASM, orchardOvkFromSeed, PlatformAddressWASM, PublicKeyWASM, PrivateKeyWASM } from 'pshenmic-dpp'
import hexToBytes from '../utils/hexToBytes.js'

const DASH_VERSIONS = {
  mainnet: { pubKeyHash: 0x4c, scriptHash: 0x10, bech32: 'dc', wif: 0xcc, private: 0x0488ade4, public: 0x0488b21e },
  testnet: { pubKeyHash: 0x8c, scriptHash: 0x13, bech32: 'dc', wif: 0xef, private: 0x04358394, public: 0x043587cf }
}

// DIP-17 transparent platform-address derivation path:
// m/9'/coinType'/17'/account'/keyClass'/index. keyClass 0 = clear funds.
const PLATFORM_ADDRESS_FEATURE = 17
const PLATFORM_ADDRESS_KEY_CLASS_CLEAR_FUNDS = 0
// PlatformAddressWASM payload variant byte: 0x00 = P2PKH, 0x01 = P2SH.
const PLATFORM_ADDRESS_P2PKH_VARIANT_BYTE = 0x00

// Encode a transparent platform P2PKH address (DIP-18) from a Hash160 pubkey
// hash (hex), producing the canonical `variantByte || hash` PlatformAddress.
const platformAddressFromPublicKeyHash = (pubKeyHashHex: string): PlatformAddressWASM => {
  const payload = Uint8Array.from([PLATFORM_ADDRESS_P2PKH_VARIANT_BYTE, ...hexToBytes(pubKeyHashHex)])

  return PlatformAddressWASM.fromBytes(payload)
}

/**
 * Collection of functions to work with private keys and seed phrases
 *
 * @hideconstructor
 */
export class KeyPairController {
  /**
   * Returns seed from mnemonic phrase
   *
   * @param mnemonic {string} - The BIP39 mnemonic phrase.
   * @param salt {string=} -  Optional salt for seed derivation.
   *
   * @return {Uint8Array} Seed bytes
   */
  mnemonicToSeed (mnemonic: string, salt?: string): Uint8Array {
    return mnemonicToSeed(mnemonic, salt)
  }

  /**
   * Returns seed from mnemonic phrase
   *
   * @param seed {Uint8Array}
   * @param network {Network} network
   *
   * @return {HDKey} HDKey
   */
  seedToHdKey (seed: Uint8Array, network: Network = 'mainnet'): HDKey {
    return HDKey.fromMasterSeed(seed, DASH_VERSIONS[network])
  }

  /**
     * Allows to derive child HD Key
     *
     * @param hdKey {HDKey} - The HDKey parent instance
     * @param index {number} - Index of child
     *
     * @return {Promise<HDKey>} A promise that resolves child key
     */
  async deriveChild (hdKey: HDKey, index: number): Promise<HDKey> {
    return deriveChild(hdKey, index)
  }

  /**
     * Allows to derive HD key by path
     *
     * @param hdKey {HDKey} - The HDKey parent instance
     * @param path {string} - Path of children
     *
     * @return {Promise<HDKey>} A promise that resolves key by path
     */
  async derivePath (hdKey: HDKey, path: string): Promise<HDKey> {
    return derivePath(hdKey, path)
  }

  /**
   * Derives an {HDKey} child by identity index and key index from an {HDKey}
   *
   * Usually used to get a identity private key from seed
   *
   * @param hdKey {HDKey}
   * @param identityIndex {number}
   * @param keyIndex {number}
   * @param network {Network}
   *
   * @returns {HDKey}
   */
  deriveIdentityPrivateKey (hdKey: HDKey, identityIndex: number, keyIndex: number, network: Network): HDKey {
    const networkIndex = network === 'mainnet' ? 5 : 1

    const pathPostfix = `/5'/0'/0'/${identityIndex}'/${keyIndex}'`

    return derivePath(hdKey, `m/9'/${networkIndex}'${pathPostfix}`)
  }

  /**
   * Converts {PublicKey} to a Dash network address (P2PKH)
   *
   * @param publicKey {Uint8Array}
   * @param network {Network}
   *
   * @returns {string}
   */
  p2pkhAddress (publicKey: Uint8Array, network: Network): string {
    const P2PKH = p2pkh(publicKey, DASH_VERSIONS[network])

    return P2PKH.address
  }

  /**
   * Derives a shielded (Orchard) address from a BIP-39 seed via ZIP-32
   * (m/32'/coinType'/account').
   *
   * @param seed {Uint8Array} - BIP-39 seed bytes
   * @param network {Network} - network (selects the SLIP-44 coin type)
   * @param account {number} - ZIP-32 account index
   * @param diversifierIndex {number=} - optional diversifier index
   *
   * @returns {OrchardAddressWASM}
   */
  deriveShieldedAddress (seed: Uint8Array, network: Network, account: number, diversifierIndex?: number): OrchardAddressWASM {
    // SLIP-44 coin type: 5 = Dash mainnet, 1 = testnets. Orchard derives via ZIP-32
    const coinType = network === 'mainnet' ? 5 : 1

    return OrchardAddressWASM.fromSeed(seed, coinType, account, diversifierIndex)
  }

  /**
   * Derives the sender's Orchard outgoing viewing key (OVK, 32 bytes) from a
   * BIP-39 seed via ZIP-32 (m/32'/coinType'/account'). Used to recover the
   * outgoing notes a wallet sent.
   *
   * @param seed {Uint8Array} - BIP-39 seed bytes
   * @param network {Network} - network (selects the SLIP-44 coin type)
   * @param account {number} - ZIP-32 account index
   *
   * @returns {Uint8Array} 32-byte outgoing viewing key
   */
  deriveShieldedOutgoingViewingKey (seed: Uint8Array, network: Network, account: number): Uint8Array {
    // SLIP-44 coin type: 5 = Dash mainnet, 1 = testnets. Orchard derives via ZIP-32
    const coinType = network === 'mainnet' ? 5 : 1

    return orchardOvkFromSeed(seed, coinType, account)
  }

  /**
   * Derives the DIP-17 account-level extended public key (xpub) for the
   * clear-funds key class: m/9'/coinType'/17'/account'/0'. The seed is only
   * needed once per account — the returned xpub derives every address index
   * publicly (see {@link derivePlatformAddressFromXpub}), with no further access
   * to the seed.
   *
   * @param seed {Uint8Array} - BIP-39 seed bytes
   * @param network {Network} - network (selects the SLIP-44 coin type)
   * @param account {number} - DIP-17 account index
   *
   * @returns {Promise<string>} account-level extended public key
   */
  async derivePlatformAccountXpub (seed: Uint8Array, network: Network, account: number): Promise<string> {
    const coinType = network === 'mainnet' ? 5 : 1
    const hdKey = this.seedToHdKey(seed, network)

    const accountNode = await this.derivePath(hdKey, `m/9'/${coinType}'/${PLATFORM_ADDRESS_FEATURE}'/${account}'/${PLATFORM_ADDRESS_KEY_CLASS_CLEAR_FUNDS}'`)

    return accountNode.publicExtendedKey
  }

  /**
   * Derives a transparent platform P2PKH address from a BIP-39 seed via DIP-17
   * (m/9'/coinType'/17'/account'/0'/index).
   *
   * @param seed {Uint8Array} - BIP-39 seed bytes
   * @param network {Network} - network (selects the SLIP-44 coin type)
   * @param account {number} - DIP-17 account index
   * @param index {number} - address index
   *
   * @returns {Promise<PlatformAddressWASM>}
   */
  async derivePlatformAddress (seed: Uint8Array, network: Network, account: number, index: number): Promise<PlatformAddressWASM> {
    const coinType = network === 'mainnet' ? 5 : 1
    const hdKey = this.seedToHdKey(seed, network)

    const childNode = await this.derivePath(hdKey, `m/9'/${coinType}'/${PLATFORM_ADDRESS_FEATURE}'/${account}'/${PLATFORM_ADDRESS_KEY_CLASS_CLEAR_FUNDS}'/${index}`)

    if (childNode.publicKey == null) {
      throw new Error(`Could not derive platform address public key at index ${index}`)
    }

    return platformAddressFromPublicKeyHash(PublicKeyWASM.fromBytes(childNode.publicKey).getPublicKeyHash())
  }

  /**
   * Derives a transparent platform P2PKH address from an account-level xpub (see
   * {@link derivePlatformAccountXpub}). The address index is non-hardened, so
   * public-only derivation reproduces the exact same address as the seed-based
   * path — no seed required.
   *
   * @param xpub {string} - account-level extended public key
   * @param network {Network} - network (selects the extended-key version bytes)
   * @param index {number} - address index
   *
   * @returns {PlatformAddressWASM}
   */
  derivePlatformAddressFromXpub (xpub: string, network: Network, index: number): PlatformAddressWASM {
    const accountNode = HDKey.fromExtendedKey(xpub, DASH_VERSIONS[network])
    const childNode = accountNode.deriveChild(index)

    if (childNode.publicKey == null) {
      throw new Error(`Could not derive platform address public key at index ${index}`)
    }

    return platformAddressFromPublicKeyHash(PublicKeyWASM.fromBytes(childNode.publicKey).getPublicKeyHash())
  }

  /**
   * Derives the private key for a DIP-17 platform address by its index
   * (m/9'/coinType'/17'/account'/0'/index). Used to sign a transfer that spends
   * from that address.
   *
   * @param seed {Uint8Array} - BIP-39 seed bytes
   * @param network {Network} - network (selects the SLIP-44 coin type)
   * @param account {number} - DIP-17 account index
   * @param index {number} - address index
   *
   * @returns {Promise<PrivateKeyWASM>}
   */
  async derivePlatformAddressPrivateKey (seed: Uint8Array, network: Network, account: number, index: number): Promise<PrivateKeyWASM> {
    const coinType = network === 'mainnet' ? 5 : 1
    const hdKey = this.seedToHdKey(seed, network)
    const path = `m/9'/${coinType}'/${PLATFORM_ADDRESS_FEATURE}'/${account}'/${PLATFORM_ADDRESS_KEY_CLASS_CLEAR_FUNDS}'/${index}`

    const { privateKey } = await this.derivePath(hdKey, path)

    if (privateKey == null) {
      throw new Error(`Could not derive platform address key at ${path}`)
    }

    return PrivateKeyWASM.fromBytes(privateKey, network)
  }
}
