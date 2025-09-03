import {
  IdentifierWASM, TokenEmergencyActionWASM, TokenPricingScheduleWASM
} from 'pshenmic-dpp'

import { Versions } from 'dashhd'

export { IdentifierWASM, IdentityWASM, DocumentWASM, DataContractWASM, StateTransitionWASM, IdentityPublicKeyWASM } from 'pshenmic-dpp'

export type IdentifierLike = IdentifierWASM | string | Uint8Array

export { DashPlatformSDK } from './DashPlatformSDK'

export type MasternodeList = Record<string, MasternodeInfo>

export { AbstractSigner } from './signer/AbstractSigner'

export interface WalletToIdentityKeyOpts {
  network?: 'mainnet' | 'testnet'
}

export interface NetworkVersion {
  version: Versions
}

export interface DocumentTransitionParams {
  identityContractNonce: bigint
  amount?: bigint
  price?: bigint
  recipientId?: IdentifierLike
  prefundedVotingBalance?: {
    indexName: string
    amount: bigint
  }
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

export enum ContestedStateResultType {
  DOCUMENTS = 0,
  VOTE_TALLY = 1,
  DOCUMENTS_AND_VOTE_TALLY = 2,
}

export enum FinishedVoteOutcome {
  TOWARDS_IDENTITY = 0,
  LOCKED = 1,
  NO_PREVIOUS_WINNER = 2,
  UNRECOGNIZED = -1,
}

export interface Contender {
  identifier: IdentifierWASM
  voteCount?: number | undefined
  document?: Uint8Array
}

export interface FinishedVoteInfo {
  type: string
  wonByIdentityId?: IdentifierWASM | undefined
  finishedAtBlockHeight: string
  finishedAtCoreBlockHeight: number
  finishedAtBlockTimeMs: string
  finishedAtEpoch: number
}

export interface ContestedResourceVoteState {
  contenders: Contender[]
  abstainVoteTally?: number | undefined
  lockVoteTally?: number | undefined
  finishedVoteInfo?: FinishedVoteInfo
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

export type TokenTransitionType = 'burn' | 'mint' | 'transfer' | 'freeze' | 'unfreeze' | 'destroyFrozenFunds' | 'emergencyAction' | 'directPurchase' | 'setPriceForDirectPurchase'

export interface TokenTransitionParams {
  identityId?: IdentifierLike
  amount?: bigint
  price?: bigint | TokenPricingScheduleWASM
  totalAgreedPrice?: bigint
  publicNote?: string
  sharedEncryptedNote?: string
  privateEncryptedNote?: string
  emergencyAction?: TokenEmergencyActionWASM
}
