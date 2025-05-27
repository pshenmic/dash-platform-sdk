import {
  DataContractWASM,
  DocumentWASM,
  IdentifierWASM,
  BatchType,
  StateTransitionWASM, PlatformVersionWASM, DataContractCreateTransitionWASM
} from 'pshenmic-dpp'
import { Utils as DashHdUtils } from 'dashhd'
import mnemonicToWalletKey from './keyPairs/mnemonicToWalletKey'
import keyToXPublicKeyBytes from './keyPairs/keyToXPublicKeyBytes'
import keyToXPublicKey from './keyPairs/keyToXPublicKey'
import keyToXPrivateKeyBytes from './keyPairs/keyToXPrivateKeyBytes'
import keyToXPrivateKey from './keyPairs/keyToXPrivateKey'
import privateKeyToWif from './keyPairs/privateKeyToWif'
import publicKeyToAddress from './keyPairs/publicKeyToAddress'
import derivePath from './keyPairs/derivePath'
import deriveChild from './keyPairs/deriveChild'
import xkeyToHDXKey from './keyPairs/xkeyToHDXKey'
import keyToPublicKey from './keyPairs/keyToPublicKey'
import keyToWalletId from './keyPairs/keyToWalletId'
import seedToWalletKey from './keyPairs/seedToWalletKey'
import mnemonicToSeed from './keyPairs/mnemonicToSeed'
import hexToBytes from './utils/hexToBytes'
import bytesToHex from './utils/bytesToHex'
import base58ToUint8Array from './utils/base58ToUint8Array'
import uint8ArrayToBase58 from './utils/uint8ArrayToBase58'
import convertToHomographSafeChars from './utils/convertToHomographSafeChars'
import getBalance from './identities/getBalance'
import getByIdentifier from './identities/getByIdentifier'
import getByPublicKeyHash from './identities/getByPublicKeyHash'
import getIdentityContractNonce from './identities/getIdentityContractNonce'
import getIdentityNonce from './identities/getIdentityNonce'
import getIdentityPublicKeys from './identities/getIdentityPublicKeys'
import waitForStateTransitionResult from './stateTransitions/waitForStateTransitionResult'
import walletToIdentityKey from './keyPairs/walletToIdentityKey'
import mnemonicToIdentityKey from './keyPairs/mnemonicToIdentityKey'

export type IdentifierLike = IdentifierWASM | string | ArrayLike<number>

export type MasternodeList = Record<string, MasternodeInfo>

export interface walletToIdentityKeyOpts {
  network?: 'mainnet' | 'testnet'
}

export interface MasternodeInfo {
  proTxHash: string
  address: string
  payee: string
  status: string
  type: string
  platformNodeID: string
  platformP2PPort: number
  platformHTTPPort: number
  pospenaltyscore: number
  consecutivePayments: number
  lastpaidtime: number
  lastpaidblock: number
  owneraddress: string
  votingaddress: string
  collateraladdress: string
  pubkeyoperator: string
}

export interface NodeStatus {
  version: {
    software: {
      dapi: string
      drive?:
      | string
      | undefined
      tenderdash?: string | undefined
    } | undefined
    protocol: {
      tenderdash: {
        p2p: number
        block: number
      } | undefined
      drive: {
        latest: number
        current: number
      } | undefined
    } | undefined
  } | undefined
  node: {
    id: string
    proTxHash?: string | undefined
  } | undefined
  chain: {
    catchingUp: boolean
    latestBlockHash: string
    latestAppHash: string
    latestBlockHeight: string
    earliestBlockHash: string
    earliestAppHash: string
    earliestBlockHeight: string
    maxPeerBlockHeight: string
    coreChainLockedHeight?: number | undefined
  } | undefined
  network: {
    chainId: string
    peersCount: number
    listening: boolean
  } | undefined
  stateSync: {
    totalSyncedTime: string
    remainingTime: string
    totalSnapshots: number
    chunkProcessAvgTime: string
    snapshotHeight: string
    snapshotChunksCount: string
    backfilledBlocks: string
    backfillBlocksTotal: string
  } | undefined
  time: {
    local: string
    block?:
    | string
    | undefined
    genesis?:
    | string
    | undefined
    epoch?: number | undefined
  } | undefined
}

export interface DataContractTransitions {
  createTransition: (dataContract: DataContractWASM, identityNonce: bigint, platformVersion?: PlatformVersionWASM) => Promise<DataContractCreateTransitionWASM>
  updateTransition: (dataContract: DataContractWASM, identityNonce: bigint, platformVersion?: PlatformVersionWASM) => Promise<DataContractCreateTransitionWASM>
}

export interface DataContractsController {
  transitions: DataContractTransitions
  create: (ownerId: IdentifierLike, identityNonce: bigint, schema: object, definitions?: object, fullValidation?: boolean, platformVersion?: PlatformVersionWASM) => Promise<DataContractWASM>
  getByIdentifier: (identifier: IdentifierLike) => Promise<DataContractWASM>
}

export interface DocumentsController {
  query: (dataContractId: IdentifierLike, documentType: string, where?: ArrayLike<any>, orderBy?: ArrayLike<any>, limit?: number, startAt?: IdentifierWASM, startAfter?: IdentifierWASM) => Promise<[DocumentWASM]>
  create: (dataContract: IdentifierLike, documentType: string, data: Object, identityContractNonce: BigInt, identity: IdentifierLike) => Promise<DocumentWASM>
}

export interface NamesController {
  search: (name: string) => Promise<[DocumentWASM]>
}

export interface StateTransitionsController {
  fromDocument: (document: DocumentWASM, batchType: BatchType, identityContractNonce: BigInt) => Promise<StateTransitionWASM>
  broadcast: (stateTransition: StateTransitionWASM) => Promise<void>
  waitForStateTransitionResult: typeof waitForStateTransitionResult
}

export interface IdentitiesController {
  getBalance: typeof getBalance
  getByIdentifier: typeof getByIdentifier
  getByPublicKeyHash: typeof getByPublicKeyHash
  getIdentityContractNonce: typeof getIdentityContractNonce
  getIdentityNonce: typeof getIdentityNonce
  getIdentityPublicKeys: typeof getIdentityPublicKeys
}

export interface NodeController {
  status: () => NodeStatus
}

export interface Utils {
  hexToBytes: typeof hexToBytes
  bytesToHex: typeof bytesToHex
  base58ToUint8Array: typeof base58ToUint8Array
  uint8ArrayToBase58: typeof uint8ArrayToBase58
  convertToHomographSafeChars: typeof convertToHomographSafeChars
}

export interface KeyPairsUtils {
  mnemonicToSeed: typeof mnemonicToSeed
  seedToWalletKey: typeof seedToWalletKey
  deriveChild: typeof deriveChild
  derivePath: typeof derivePath
  keyToWalletId: typeof keyToWalletId
  keyToPublicKey: typeof keyToPublicKey
  publicKeyToAddress: typeof publicKeyToAddress
  privateKeyToWif: typeof privateKeyToWif
  keyToXPrivateKey: typeof keyToXPrivateKey
  keyToXPrivateKeyBytes: typeof keyToXPrivateKeyBytes
  keyToXPublicKey: typeof keyToXPublicKey
  keyToXPublicKeyBytes: typeof keyToXPublicKeyBytes
  xkeyToHDXKey: typeof xkeyToHDXKey
  mnemonicToWalletKey: typeof mnemonicToWalletKey
  walletToIdentityKey: typeof walletToIdentityKey
}

export interface KeyPairs {
  mnemonicToIdentityKey: typeof mnemonicToIdentityKey
  utils: DashHdUtils & KeyPairsUtils
}
