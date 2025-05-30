import {
  DataContractWASM,
  DocumentWASM,
  IdentifierWASM,
  BatchType,
  StateTransitionWASM,
  PlatformVersionWASM,
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM,
  DocumentPurchaseTransitionWASM,
  DocumentReplaceTransitionWASM,
  DocumentTransferTransitionWASM, DocumentUpdatePriceTransitionWASM
} from 'pshenmic-dpp'
import { Utils as DashHdUtils } from 'dashhd'
import mnemonicToWallet from './keyPair/mnemonicToWallet'
import keyToXPublicKey from './keyPair/keyToXPublicKey'
import keyToXPrivateKey from './keyPair/keyToXPrivateKey'
import privateKeyToWif from './keyPair/privateKeyToWif'
import publicKeyToAddress from './keyPair/publicKeyToAddress'
import derivePath from './keyPair/derivePath'
import deriveChild from './keyPair/deriveChild'
import xkeyToHDXKey from './keyPair/xkeyToHDXKey'
import keyToPublicKey from './keyPair/keyToPublicKey'
import keyToWalletId from './keyPair/keyToWalletId'
import seedToWallet from './keyPair/seedToWallet'
import mnemonicToSeed from './keyPair/mnemonicToSeed'
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
import walletToIdentityKey from './keyPair/walletToIdentityKey'
import mnemonicToIdentityKey from './keyPair/mnemonicToIdentityKey'
import createDataContractTransition from './stateTransitions/dataContract/createDataContractTransition'
import updateDataContractTransition from './stateTransitions/dataContract/updateDataContractTransition'
import documentCreateTransition from './stateTransitions/documentsBatch/create'
import documentReplaceTransition from './stateTransitions/documentsBatch/replace'
import documentDeleteTransition from './stateTransitions/documentsBatch/delete'
import documentPurchaseTransition from './stateTransitions/documentsBatch/purchase'
import documentUpdatePriceTransition from './stateTransitions/documentsBatch/updatePrice'
import documentTransferTransition from './stateTransitions/documentsBatch/transfer'
import getDocument from './documents/get'
import createDocument from './documents/create'

export type IdentifierLike = IdentifierWASM | string | ArrayLike<number>

export type DocumentTransitionLike = DocumentCreateTransitionWASM | DocumentDeleteTransitionWASM | DocumentPurchaseTransitionWASM | DocumentReplaceTransitionWASM | DocumentTransferTransitionWASM | DocumentUpdatePriceTransitionWASM

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

export interface DataContractConfig {
  $format_version: string
  canBeDeleted: boolean
  readonly: boolean
  keepsHistory: boolean
  documentsKeepHistoryContractDefault: boolean
  documentsMutableContractDefault: boolean
  documentsCanBeDeletedContractDefault: boolean
  requiresIdentityEncryptionBoundedKey?: number | null
  requiresIdentityDecryptionBoundedKey?: number | null
}

export interface DataContractTransitions {
  create: typeof createDataContractTransition
  update: typeof updateDataContractTransition
}

export interface DataContractsController {
  create: (ownerId: IdentifierLike, identityNonce: bigint, schema: object, definitions?: object, fullValidation?: boolean, config?: DataContractConfig, platformVersion?: PlatformVersionWASM) => Promise<DataContractWASM>
  getByIdentifier: (identifier: IdentifierLike) => Promise<DataContractWASM>
}

export interface DocumentsBatchController {
  create: typeof documentCreateTransition
  delete: typeof documentDeleteTransition
  purchase: typeof documentPurchaseTransition
  replace: typeof documentReplaceTransition
  transfer: typeof documentTransferTransition
  updatePrice: typeof documentUpdatePriceTransition
}

export interface DocumentsController {
  query: typeof getDocument
  create: typeof createDocument
}

export interface NamesController {
  search: (name: string) => Promise<[DocumentWASM]>
}

export interface StateTransitionsController {
  dataContract: DataContractTransitions
  documentsBatch: DocumentsBatchController
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

export interface KeyPairUtils {
  mnemonicToSeed: typeof mnemonicToSeed
  seedToWallet: typeof seedToWallet
  deriveChild: typeof deriveChild
  derivePath: typeof derivePath
  keyToWalletId: typeof keyToWalletId
  keyToPublicKey: typeof keyToPublicKey
  publicKeyToAddress: typeof publicKeyToAddress
  privateKeyToWif: typeof privateKeyToWif
  keyToXPrivateKey: typeof keyToXPrivateKey
  keyToXPublicKey: typeof keyToXPublicKey
  xkeyToHDXKey: typeof xkeyToHDXKey
  mnemonicToWallet: typeof mnemonicToWallet
  walletToIdentityKey: typeof walletToIdentityKey
}

export interface KeyPair {
  mnemonicToIdentityKey: typeof mnemonicToIdentityKey
  utils: DashHdUtils & KeyPairUtils
}
