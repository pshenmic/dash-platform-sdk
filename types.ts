import {
  AddressFundsFeeStrategyStepWASM,
  AssetLockProofWASM,
  CoreScriptWASM,
  DocumentActionFeeAgreementWASM,
  DocumentWASM,
  GasFeesPaidByWASM, GroupStateTransitionInfoWASM, IdentifierLike,
  IdentifierWASM,
  IdentityPublicKeyWASM,
  InputAddressWASM,
  KeyType,
  PlatformAddressLike,
  PlatformAddressWASM,
  PlatformVersionWASM,
  PoolingLike,
  PrivateKeyWASM,
  Purpose, SecurityLevel,
  TokenEmergencyActionWASM,
  TokenPricingScheduleWASM,
  AddressWitnessWASM,
  IdentityPublicKeyInCreationWASM,
  OutputAddressWASM,
  OutputAddressNullableCreditsWASM,
  VerifiedAddressesTrunkState
} from 'pshenmic-dpp'
import type { OrchardAddressWASM, ShieldedOutputWASM, SpendableNoteWASM } from 'dash-platform-shielded'
import { ResponseMetadata } from './proto/generated/platform.js'

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

export type DocumentTransitionType = 'create' | 'replace' | 'delete' | 'erase' | 'updatePrice' | 'transfer' | 'purchase'

/**
 * The action fee a document transition agrees to pay to the contract fee pots (protocol v14).
 * Required when the document type declares `actionFees` for the action, ignored otherwise
 */
export interface DocumentActionFeeAgreement {
  /** owner part the document type declares for the action, in credits */
  owner: bigint
  /** moderators part the document type declares for the action, in credits */
  moderators: bigint
  /** set when the fee is priced by the epoch fee multiplier, omit for a fixed fee */
  feeMultiplier?: {
    /** fee multiplier of the current epoch, in permille */
    knownPermille: bigint
    /** how far above the known multiplier the executing epoch's one may be, in percent */
    increaseTolerancePercent: number
  }
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
  tokenPaymentInfo?: {
    tokenContractId: IdentifierLike
    tokenContractPosition: number
    minimumTokenCost?: bigint
    maximumTokenCost?: bigint
    gasFeesPaidBy: GasFeesPaidByWASM
  }
  actionFeeAgreement?: DocumentActionFeeAgreement | DocumentActionFeeAgreementWASM
}

export interface ShieldedTransitionBaseParams {
  /** version of the platform (defaults to the latest supported version) */
  platformVersion?: PlatformVersionWASM
}

/** Spend inputs shared by `shieldedWithdrawal`, `unshield`, `shieldedTransfer` and `identityCreateFromShieldedPool`. */
export interface ShieldedSpendParams extends ShieldedTransitionBaseParams {
  spends: SpendableNoteWASM[]
  changeAddress: OrchardAddressWASM
  seed: Uint8Array
  coinType: number
  account: number
  anchor: Uint8Array
  /** optional UTF-8 memo string (defaults to an empty memo) */
  memo?: string
  /**
   * optional payment reference memo (protocol v15), 1 to 32 bytes, e.g. an invoice or order number
   * the payee gave to the payer. Mutually exclusive with `memo`
   */
  paymentRef?: Uint8Array
}

/** Transparent platform addresses -> pool (deposit). */
export interface ShieldParams extends ShieldedTransitionBaseParams {
  recipient: OrchardAddressWASM
  shieldAmount: bigint
  inputs: InputAddressWASM[]
  privateKeys: PrivateKeyWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  userFeeIncrease: number
  /** optional UTF-8 memo string (defaults to an empty memo) */
  memo?: string
  /** optional payment reference memo (protocol v15), 1 to 32 bytes. Mutually exclusive with `memo` */
  paymentRef?: Uint8Array
  senderOvk?: Uint8Array
}

/** Asset lock -> pool (deposit). */
export interface ShieldFromAssetLockParams extends ShieldedTransitionBaseParams {
  recipient: OrchardAddressWASM
  shieldAmount: bigint
  assetLockProof: AssetLockProofWASM
  privateKey: PrivateKeyWASM
  /** optional UTF-8 memo string (defaults to an empty memo) */
  memo?: string
  /** optional payment reference memo (protocol v15), 1 to 32 bytes. Mutually exclusive with `memo` */
  paymentRef?: Uint8Array
  dummyOutputs: number
  senderOvk?: Uint8Array
  surplusOutput?: PlatformAddressLike
}

/** Pool -> core L1 (spend). */
export interface ShieldedWithdrawalParams extends ShieldedSpendParams {
  withdrawalAmount: bigint
  outputScript: CoreScriptWASM
  coreFeePerByte: number
  pooling: PoolingLike
}

/** Pool -> platform identity balance (spend). */
export interface UnshieldParams extends ShieldedSpendParams {
  outputAddress: PlatformAddressLike
  unshieldAmount: bigint
}

/** Pool -> pool (spend). */
export interface ShieldedTransferParams extends ShieldedSpendParams {
  recipient: OrchardAddressWASM
  transferAmount: bigint
}

/** Pool -> pool, several recipients (spend). Each output carries its own memo. */
export interface ShieldedTransferMultiParams extends Omit<ShieldedSpendParams, 'memo' | 'paymentRef'> {
  outputs: ShieldedOutputWASM[]
}

/** Pool -> new identity (spend). */
export interface IdentityCreateFromShieldedPoolParams extends ShieldedSpendParams {
  publicKeys: IdentityPublicKeyInCreation[]
  privateKeys: PrivateKeyWASM[]
  denomination: bigint
  sendToAddressOnCreationFailure: PlatformAddressLike
}

/**
 * Pool -> private document entries (spend, protocol v15+). No identity signs: the data contract,
 * document type and entries are bound into the bundle's sighash, and the fee is pinned by consensus
 * to the bundle's value balance.
 */
export interface PrivateDocumentCreateFromShieldedPoolParams extends Omit<ShieldedSpendParams, 'memo' | 'paymentRef'> {
  /** contract owning the private document type */
  dataContractId: IdentifierLike
  /** private document type to create entries in */
  documentTypeName: string
  /**
   * Already-built entries, 1 to 16, each exactly the private document type's `private.entrySize`
   * bytes: the standard private document envelope (v1) wrapping the encrypted plaintext payload.
   * These are not plain document bodies — build them with {ShieldedController.sealPrivateDocumentEntry}
   */
  entries: Uint8Array[]
}

/**
 * The token shielded pool a token action is bound to. The credit pool is one per network;
 * a token pool belongs to one token of one data contract, so every token action names it.
 */
export interface TokenPoolParams extends ShieldedTransitionBaseParams {
  tokenId: IdentifierLike
  dataContractId: IdentifierLike
  tokenContractPosition: number
  /** optional UTF-8 memo string (defaults to an empty memo) */
  memo?: string
  /** optional payment reference memo (protocol v15), 1 to 32 bytes. Mutually exclusive with `memo` */
  paymentRef?: Uint8Array
}

/**
 * What a token action signed by the owner identity needs beyond its pool: the identity that
 * signs the batch transition and pays its fee out of its own credit balance.
 */
export interface TokenOwnerSignedParams extends TokenPoolParams {
  ownerId: IdentifierLike
  identityPublicKey: IdentityPublicKeyWASM
  privateKey: PrivateKeyWASM
  identityContractNonce: bigint
  userFeeIncrease: number
}

/** Spend inputs of a token pool spend, witnessed against that token pool's own anchor. */
export interface TokenSpendParams {
  spends: SpendableNoteWASM[]
  changeAddress: OrchardAddressWASM
  seed: Uint8Array
  coinType: number
  account: number
  anchor: Uint8Array
}

/**
 * Spend inputs of an action that spends token notes and credit notes at once: the token pool
 * moves the tokens and the credit pool pays the fee, each witnessed against its own anchor.
 * No identity signs and no identity balance is touched.
 */
export interface TokenAndFeeSpendParams {
  tokenSpends: SpendableNoteWASM[]
  tokenChangeAddress: OrchardAddressWASM
  tokenAnchor: Uint8Array
  feeSpends: SpendableNoteWASM[]
  feeChangeAddress: OrchardAddressWASM
  feeAnchor: Uint8Array
  seed: Uint8Array
  coinType: number
  account: number
}

/** Owner token balance -> token pool (deposit). */
export interface TokenShieldParams extends TokenOwnerSignedParams {
  recipient: OrchardAddressWASM
  amount: bigint
  senderOvk?: Uint8Array
}

/** Token pool -> `recipientId`'s token balance (spend). */
export interface TokenUnshieldParams extends TokenOwnerSignedParams, TokenSpendParams {
  recipientId: IdentifierLike
  amount: bigint
}

/** Token pool -> token pool (spend). */
export interface TokenShieldedTransferParams extends TokenOwnerSignedParams, TokenSpendParams {
  recipient: OrchardAddressWASM
  transferAmount: bigint
}

/** Newly minted tokens -> token pool. */
export interface TokenMintToPoolParams extends TokenOwnerSignedParams {
  recipient: OrchardAddressWASM
  amount: bigint
  senderOvk?: Uint8Array
  /** optional public note recorded with the action */
  publicNote?: string
  /** pass it when the contract requires a group to authorize the action */
  usingGroupInfo?: GroupStateTransitionInfoWASM
}

/** Tokens burned out of the token pool (spend). */
export interface TokenBurnFromPoolParams extends TokenOwnerSignedParams, TokenSpendParams {
  amount: bigint
  /** optional public note recorded with the action */
  publicNote?: string
  /** pass it when the contract requires a group to authorize the action */
  usingGroupInfo?: GroupStateTransitionInfoWASM
}

/** A claimed token distribution -> token pool. */
export interface TokenClaimToPoolParams extends TokenOwnerSignedParams {
  recipient: OrchardAddressWASM
  amount: bigint
  distributionType: string | number
  /** upper bound of the distribution moment being claimed, for a perpetual distribution */
  claimUpTo?: bigint
  senderOvk?: Uint8Array
  /** optional public note recorded with the action */
  publicNote?: string
}

/** Tokens bought at their direct purchase price -> token pool. */
export interface TokenDirectPurchaseToPoolParams extends TokenOwnerSignedParams {
  recipient: OrchardAddressWASM
  tokenCount: bigint
  totalAgreedPrice: bigint
  senderOvk?: Uint8Array
}

/** Token pool -> token pool, fee paid from the credit pool (spend). */
export interface TokenShieldedTransferWithShieldedFeeParams extends TokenPoolParams, TokenAndFeeSpendParams {
  recipient: OrchardAddressWASM
  transferAmount: bigint
}

/** Token pool -> `recipientId`'s token balance, fee paid from the credit pool (spend). */
export interface TokenUnshieldWithShieldedFeeParams extends TokenPoolParams, TokenAndFeeSpendParams {
  recipientId: IdentifierLike
  amount: bigint
}

/**
 * Tokens bought at their direct purchase price -> token pool, price and fee both paid from
 * the credit pool (spend). Nothing is spent out of a token pool, so there is no token anchor.
 */
export interface TokenPurchaseFromShieldedPoolParams extends TokenPoolParams,
  Omit<TokenAndFeeSpendParams, 'tokenSpends' | 'tokenChangeAddress' | 'tokenAnchor'> {
  recipient: OrchardAddressWASM
  tokenCount: bigint
  totalAgreedPrice: bigint
}

/** Maps each shielded transition type to the params it requires. */
export interface ShieldedTransitionParamsMap {
  shield: ShieldParams
  shieldFromAssetLock: ShieldFromAssetLockParams
  shieldedWithdrawal: ShieldedWithdrawalParams
  unshield: UnshieldParams
  shieldedTransfer: ShieldedTransferParams
  shieldedTransferMulti: ShieldedTransferMultiParams
  identityCreateFromShieldedPool: IdentityCreateFromShieldedPoolParams
  privateDocumentCreateFromShieldedPool: PrivateDocumentCreateFromShieldedPoolParams
  tokenShield: TokenShieldParams
  tokenUnshield: TokenUnshieldParams
  tokenShieldedTransfer: TokenShieldedTransferParams
  tokenMintToPool: TokenMintToPoolParams
  tokenBurnFromPool: TokenBurnFromPoolParams
  tokenClaimToPool: TokenClaimToPoolParams
  tokenDirectPurchaseToPool: TokenDirectPurchaseToPoolParams
  tokenShieldedTransferWithShieldedFee: TokenShieldedTransferWithShieldedFeeParams
  tokenUnshieldWithShieldedFee: TokenUnshieldWithShieldedFeeParams
  tokenPurchaseFromShieldedPool: TokenPurchaseFromShieldedPoolParams
}

export type ShieldedTransitionType = keyof ShieldedTransitionParamsMap

export type ShieldedTransitionParams = ShieldedTransitionParamsMap[ShieldedTransitionType]

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

/** The answer of a yes/no vote (protocol v15), used by decision proposal polls */
export type YesNoVoteChoice = 'yes' | 'no' | 'abstain'

export interface PlatformAddressInfo {
  address: PlatformAddressWASM
  nonce: number
  balance: bigint
}

export interface PlatformAddressesTrunkState {
  trunk: VerifiedAddressesTrunkState
  metadata: ResponseMetadata
}

export interface ShieldedEncryptedNote {
  nullifier: Uint8Array
  cmx: Uint8Array
  encryptedNote: Uint8Array
  cvNet: Uint8Array
}

export interface ShieldedNullifierStatus {
  nullifier: Uint8Array
  isSpent: boolean
}

/**
 * Fields shared by the address-funded transitions (the ones spending platform address inputs).
 *
 * The `inputWitness` arrays are produced by the client application (wallet / mobile / browser
 * extension), which is where the address private keys live. The builders only assemble the
 * transition - they never sign or hit the network.
 */
export interface AddressFundsBaseParams {
  inputs: InputAddressWASM[]
  feeStrategy: AddressFundsFeeStrategyStepWASM[]
  inputWitness: AddressWitnessWASM[]
  userFeeIncrease?: number
}

/** Identity -> platform addresses (transition type 9). */
export interface IdentityCreditTransferToAddressesParams {
  identityId: IdentifierLike
  recipients: OutputAddressWASM[]
  nonce: bigint
  userFeeIncrease?: number
}

/** Platform addresses -> new identity (transition type 10). */
export interface IdentityCreateFromAddressesParams extends AddressFundsBaseParams {
  publicKeys: IdentityPublicKeyInCreationWASM[]
  output?: OutputAddressWASM
}

/** Platform addresses -> existing identity (transition type 11). */
export interface IdentityTopUpFromAddressesParams extends AddressFundsBaseParams {
  identityId: IdentifierLike
  output?: OutputAddressWASM
}

/** Platform addresses -> platform addresses (transition type 12). */
export interface AddressFundsTransferParams extends AddressFundsBaseParams {
  outputs: OutputAddressWASM[]
}

/** Asset lock -> platform addresses (transition type 13). */
export interface AddressFundingFromAssetLockParams extends AddressFundsBaseParams {
  assetLockProof: AssetLockProofWASM
  outputs: OutputAddressNullableCreditsWASM[]
}

/** Platform addresses -> core L1 (transition type 14). */
export interface AddressCreditWithdrawalParams extends AddressFundsBaseParams {
  coreFeePerByte: number
  pooling: 'Standard' | 'Never' | 'IfAvailable'
  outputScript: CoreScriptWASM
  output?: OutputAddressWASM
}

/** Maps each platform address transition type to the params it requires. */
export interface PlatformAddressTransitionParamsMap {
  identityCreditTransferToAddresses: IdentityCreditTransferToAddressesParams
  identityCreateFromAddresses: IdentityCreateFromAddressesParams
  identityTopUpFromAddresses: IdentityTopUpFromAddressesParams
  addressFundsTransfer: AddressFundsTransferParams
  addressFundingFromAssetLock: AddressFundingFromAssetLockParams
  addressCreditWithdrawal: AddressCreditWithdrawalParams
}

export type PlatformAddressTransitionType = keyof PlatformAddressTransitionParamsMap

export type PlatformAddressTransitionParams = PlatformAddressTransitionParamsMap[PlatformAddressTransitionType]
