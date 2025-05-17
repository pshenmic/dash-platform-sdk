import {
  DataContractWASM,
  DocumentWASM,
  IdentifierWASM,
  BatchType,
  StateTransitionWASM,
  IdentityWASM, IdentityPublicKeyWASM
} from 'pshenmic-dpp'

export type IdentifierLike = IdentifierWASM | string | ArrayLike<number>

export type MasternodeList = Record<string, MasternodeInfo>

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

export interface DataContractsController {
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
  waitForStateTransitionResult: (stateTransitionHash: Uint8Array<ArrayBufferLike>) => Promise<void>
}

export interface IdentitiesController {
  getBalance: (identifier: IdentifierLike) => Promise<BigInt>
  getByIdentifier: (identifier: IdentifierLike) => Promise<IdentityWASM>
  getByPublicKeyHash: (hex: string) => Promise<IdentityWASM>
  getIdentityContractNonce: (identity: IdentifierLike, dataContract: IdentifierLike) => Promise<BigInt>
  getIdentityNonce: (identifier: IdentifierLike) => Promise<BigInt>
  getIdentityPublicKeys: (identifier: IdentifierLike) => Promise<[IdentityPublicKeyWASM]>
}

export interface NodeController {
  status: () => NodeStatus
}

export interface Utils {
  hexToBytes: (hex: string) => Uint8Array
  bytesToHex: (bytes: ArrayLike<number>) => string
  base58ToUint8Array: (string: string) => Uint8Array
  uint8ArrayToBase58: (uint8Array: Uint8Array) => string
  convertToHomographSafeChars: (input: string) => string
}
