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
  DocumentTransferTransitionWASM,
  DocumentUpdatePriceTransitionWASM,
  IdentityWASM
} from 'pshenmic-dpp'
import { Utils as DashHdUtils } from 'dashhd'
export type IdentifierLike = IdentifierWASM | string | ArrayLike<number>

export {DashPlatformSDK} from './index'
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
  create: Function
  update: Function
}

export interface DataContractsController {
  create: (ownerId: IdentifierLike, identityNonce: bigint, schema: object, definitions?: object, fullValidation?: boolean, config?: DataContractConfig, platformVersion?: PlatformVersionWASM) => Promise<DataContractWASM>
  getByIdentifier: (identifier: IdentifierLike) => Promise<DataContractWASM>
}

export interface DocumentsBatchController {
  create: Function
  delete: Function
  purchase: Function
  replace: Function
  transfer: Function
  updatePrice: Function
}

export interface DocumentsController {
  query: Function
  create: Function
}

export interface NamesController {
  search: (name: string) => Promise<[DocumentWASM]>
}

export interface StateTransitionsController {
  dataContract: DataContractTransitions
  documentsBatch: DocumentsBatchController
  fromDocument: (document: DocumentWASM, batchType: BatchType, identityContractNonce: BigInt) => Promise<StateTransitionWASM>
  broadcast: (stateTransition: StateTransitionWASM) => Promise<void>
  waitForStateTransitionResult: Function
}

export interface IdentitiesController {
  getBalance: Function
  getByIdentifier: Function
  getByPublicKeyHash: Function
  getIdentityContractNonce: Function
  getIdentityNonce: Function
  getIdentityPublicKeys: Function
}

export interface NodeController {
  status: () => NodeStatus
}

export interface Utils {
  hexToBytes: Function
  bytesToHex: Function
  base58ToUint8Array: Function
  uint8ArrayToBase58: Function
  convertToHomographSafeChars: Function
}

export interface KeyPairUtils {
  mnemonicToSeed: Function
  seedToWallet: Function
  deriveChild: Function
  derivePath: Function
  keyToWalletId: Function
  keyToPublicKey: Function
  publicKeyToAddress: Function
  privateKeyToWif: Function
  keyToXPrivateKey: Function
  keyToXPublicKey: Function
  xkeyToHDXKey: Function
  mnemonicToWallet: Function
  walletToIdentityKey: Function
}

export interface KeyPair {
  mnemonicToIdentityKey: Function
  utils: DashHdUtils & KeyPairUtils
}

export interface Signer {
  setSigner: Function
  signer: AbstractSigner | null
}

export interface AbstractSigner {
  connect() : void
  getCurrentIdentity() : IdentityWASM
  signStateTransition(stateTransition: StateTransitionWASM, identity: IdentityWASM): void
}
