import {
  CoreScriptWASM,
  DocumentWASM,
  GasFeesPaidByWASM, IdentifierLike,
  IdentifierWASM,
  KeyType, PlatformAddressLike, PlatformAddressWASM, Purpose, SecurityLevel,
  TokenEmergencyActionWASM,
  TokenPricingScheduleWASM,
  AddressFundsFeeStrategyStepWASM,
  AddressWitnessWASM,
  AssetLockProofWASM,
  IdentityPublicKeyInCreationWASM,
  InputAddressWASM,
  OutputAddressWASM,
  OutputAddressNullableCreditsWASM
} from 'pshenmic-dpp'

export {
  CoreScriptWASM,
  DocumentWASM,
  GasFeesPaidByWASM,
  IdentifierWASM,
  KeyType, Purpose, SecurityLevel,
  TokenEmergencyActionWASM,
  TokenPricingScheduleWASM,
  StateTransitionWASM,
  BatchTransitionWASM,
  IdentityPublicKeyWASM,
  PrivateKeyWASM,
  DataContractUpdateTransitionWASM,
  IdentityWASM,
  IdentityUpdateTransitionWASM,
  IdentityCreditTransferWASM,
  MasternodeVoteTransitionWASM,
  IdentifierLike,
  PlatformAddressLike,
  InputAddressWASM,
  OutputAddressWASM,
  OutputAddressNullableCreditsWASM,
  AddressFundsFeeStrategyStepWASM,
  AddressWitnessWASM,
  IdentityPublicKeyInCreationWASM,
  AssetLockProofWASM,
  IdentityCreditTransferToAddressesTransitionWASM,
  IdentityCreateFromAddressesTransitionWASM,
  IdentityTopUpFromAddressesTransitionWASM,
  AddressFundsTransferTransitionWASM,
  AddressFundingFromAssetLockTransitionWASM,
  AddressCreditWithdrawalTransitionWASM
} from 'pshenmic-dpp'

export type Network = 'mainnet' | 'testnet'

export { DashPlatformSDK } from './src/DashPlatformSDK.js'

export type MasternodeList = Record<string, MasternodeInfo>

export interface DocumentTransitionParams {
  identityContractNonce: bigint
  amount?: bigint
  price?: bigint
  recipientId?: IdentifierLike
  prefundedVotingBalance?: {
    indexName: string
    amount: bigint
  }
  tokenPaymentInfo?: {
    tokenContractId: IdentifierLike
    tokenContractPosition: number
    minimumTokenCost?: bigint
    maximumTokenCost?: bigint
    gasFeesPaidBy: GasFeesPaidByWASM
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
    software?: {
      dapi: string
      drive?:
      | string
      | undefined
      tenderdash?: string | undefined
    } | undefined
    protocol?: {
      tenderdash?: {
        p2P: number
        block: number
      } | undefined
      drive?: {
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
  document?: Uint8Array | DocumentWASM
}

export interface FinishedVoteInfo {
  type: string
  wonByIdentityId?: IdentifierWASM | undefined
  finishedAtBlockHeight: bigint
  finishedAtCoreBlockHeight: number
  finishedAtBlockTimeMs: bigint
  finishedAtEpoch?: number
}

export interface ContestedResourceVoteState {
  contenders: Contender[]
  abstainVoteTally?: number | undefined
  lockVoteTally?: number | undefined
  skipped: boolean
  finishedVoteInfo?: FinishedVoteInfo
}

export interface DataContractConfig {
  $formatVersion: string
  canBeDeleted: boolean
  readonly: boolean
  keepsHistory: boolean
  documentsKeepHistoryContractDefault: boolean
  documentsMutableContractDefault: boolean
  documentsCanBeDeletedContractDefault: boolean
  requiresIdentityEncryptionBoundedKey?: number | null
  requiresIdentityDecryptionBoundedKey?: number | null
  sizedIntegerTypes: boolean
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

export interface ChainAssetLockProof {
  /** Best Core chain locked height **/
  coreChainLockedHeight: number
  /** Txid of AssetLock transaction in hex **/
  txid: string
  /** OP_RETURN output index **/
  outputIndex: number
  type: 'chainLock'
}

export interface InstantLockAssetLockProof {
  /** Full Core AssetLock transaction in hex **/
  transaction: string
  /** OP_RETURN output index **/
  outputIndex: number
  /** Signature of InstantSend Lock in hex **/
  instantLock: string
  type: 'instantLock'
}

export interface IdentityPublicKeyInCreation {
  id: number
  purpose: Purpose
  securityLevel: SecurityLevel
  keyType: KeyType
  readOnly: boolean
  data: Uint8Array
  signature?: Uint8Array
  contractBounds?: {
    dataContractId: IdentifierLike
    documentType?: string
  }
}

export interface IdentityTransitionParams {
  publicKeys?: IdentityPublicKeyInCreation[]
  assetLockProof?: ChainAssetLockProof | InstantLockAssetLockProof
  signature?: Uint8Array
  addPublicKeys?: IdentityPublicKeyInCreation[]
  disablePublicKeyIds?: number[]
  revision?: bigint
  identityNonce?: bigint
  amount?: bigint
  identityId?: IdentifierLike
  recipientId?: IdentifierLike
  withdrawalAddress?: string
  outputScript?: CoreScriptWASM
  pooling?: 'Standard' | 'Never' | 'IfAvailable'
  coreFeePerByte?: number
  userFeeIncrease?: number
}

export interface TokenTotalSupply {
  tokenId: IdentifierWASM
  totalSystemAmount: bigint
  totalAggregatedAmountInUserAccounts: bigint
}

export interface TokenDirectPurchasePrices {
  tokenId: IdentifierWASM
  pricingSchedule?: TokenPricingScheduleWASM | undefined
}

export type ResourceVoteChoice = IdentifierLike | 'lock' | 'abstain'

export interface PlatformAddressInfo {
  address: PlatformAddressWASM
  nonce: number
  balance: bigint
}

export interface PlatformAddressTransitionParams {
  identityId?: IdentifierLike
  publicKeys?: IdentityPublicKeyInCreationWASM[]
  inputs?: InputAddressWASM[]
  outputs?: OutputAddressWASM[] | OutputAddressNullableCreditsWASM[]
  recipients?: OutputAddressWASM[]
  output?: OutputAddressWASM
  feeStrategy?: AddressFundsFeeStrategyStepWASM[]
  inputWitness?: AddressWitnessWASM[]
  assetLockProof?: AssetLockProofWASM
  nonce?: bigint
  coreFeePerByte?: number
  pooling?: 'Standard' | 'Never' | 'IfAvailable'
  outputScript?: CoreScriptWASM
  userFeeIncrease?: number
}

/**
 * The `inputWitness` arrays carried by the address-funded transitions below are produced by the
 * client application (wallet / mobile / browser extension), which is where the address private keys
 * live. These convenience builders only assemble the transition - they never sign or hit the network.
 */
export interface TransferToAddressParams {
  identityId: IdentifierLike
  nonce: bigint
  /** A single recipient address; combined with `amount` to build a recipient output **/
  recipient?: PlatformAddressLike
  amount?: bigint
  /** Pass explicit recipient outputs instead of `recipient` + `amount` **/
  recipients?: OutputAddressWASM[]
  userFeeIncrease?: number
}

export interface CreateIdentityFromAddressesParams {
  publicKeys: IdentityPublicKeyInCreationWASM[]
  inputs: InputAddressWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  inputWitness: AddressWitnessWASM[]
  output?: OutputAddressWASM
  userFeeIncrease?: number
}

export interface TopUpFromAddressesParams {
  identityId: IdentifierLike
  inputs: InputAddressWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  inputWitness: AddressWitnessWASM[]
  output?: OutputAddressWASM
  userFeeIncrease?: number
}

export interface TransferBetweenAddressesParams {
  inputs: InputAddressWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  inputWitness: AddressWitnessWASM[]
  outputs: OutputAddressWASM[]
  userFeeIncrease?: number
}

export interface FundFromAssetLockParams {
  assetLockProof: AssetLockProofWASM
  inputs: InputAddressWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  inputWitness: AddressWitnessWASM[]
  outputs: OutputAddressNullableCreditsWASM[]
  userFeeIncrease?: number
}

export interface WithdrawalToCoreParams {
  inputs: InputAddressWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  inputWitness: AddressWitnessWASM[]
  /** A Core (L1) address; converted to a P2PKH `outputScript` **/
  coreAddress?: string
  /** Pass an explicit output script instead of `coreAddress` **/
  outputScript?: CoreScriptWASM
  coreFeePerByte?: number
  pooling?: 'Standard' | 'Never' | 'IfAvailable'
  output?: OutputAddressWASM
  userFeeIncrease?: number
}
