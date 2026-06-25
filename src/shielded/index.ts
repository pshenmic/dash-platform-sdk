import GRPCConnectionPool from '../grpcConnectionPool.js'
import {
  IdentityCreateFromShieldedPoolParams,
  ShieldedEncryptedNote,
  ShieldedNullifierStatus,
  ShieldedTransitionParamsMap,
  ShieldedTransitionType
} from '../../types.js'
import getShieldedEncryptedNotes from './getShieldedEncryptedNotes.js'
import getShieldedAnchors from './getShieldedAnchors.js'
import getMostRecentShieldedAnchor from './getMostRecentShieldedAnchor.js'
import getShieldedPoolState from './getShieldedPoolState.js'
import getShieldedNotesCount from './getShieldedNotesCount.js'
import getShieldedNullifiers from './getShieldedNullifiers.js'
import createStateTransition from './createStateTransition.js'
import {
  CommitmentTreeWASM,
  ContractBoundsWASM,
  IdentityPublicKeyInCreationWASM,
  recoverNotes,
  RecoveredNoteWASM,
  SerializedActionWASM,
  ShieldedBuilderWASM,
  ShieldedMemoWASM,
  SpendableNoteWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'

/**
 * Shielded controller for requesting information about shielded pool
 *
 * @hideconstructor
 */
export class ShieldedController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  /** @ignore **/
  shieldedBuilder?: ShieldedBuilderWASM

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Set bindings instance of builder
   * Needed for custom builder load, because ShieldedBuilderWASM inits very slow on old hardware
   */
  init(builder?: ShieldedBuilderWASM): ShieldedBuilderWASM {
    this.shieldedBuilder = builder ?? new ShieldedBuilderWASM()

    return this.shieldedBuilder
}

  /**
   * Lazily constructs and caches a {ShieldedBuilderWASM}. Construction builds
   * the Halo 2 proving key (~seconds), so the instance is created once and reused.
   *
   * @ignore
   */
  getShieldedBuilder (): ShieldedBuilderWASM {
    if (this.shieldedBuilder == null) {
      return this.init()
    }

    return this.shieldedBuilder
  }

  /**
   * Retrieves a batch of shielded encrypted notes from the shielded pool,
   * starting from the given note index.
   *
   * Returns an array of encrypted notes, each containing the nullifier,
   * note commitment (cmx), encrypted note payload and value commitment (cvNet).
   *
   * @param startIndex {bigint} - index of the first note to fetch
   * @param count {number} - amount of notes to fetch
   *
   * @return {Promise<ShieldedEncryptedNote[]>}
   */
  async getShieldedEncryptedNotes (startIndex: bigint, count: number): Promise<ShieldedEncryptedNote[]> {
    return await getShieldedEncryptedNotes(this.grpcPool, startIndex, count)
  }

  /**
   * Retrieves the set of valid anchors (note commitment tree roots) currently
   * accepted by the shielded pool.
   *
   * @return {Promise<Uint8Array[]>}
   */
  async getShieldedAnchors (): Promise<Uint8Array[]> {
    return await getShieldedAnchors(this.grpcPool)
  }

  /**
   * Retrieves the most recent anchor (note commitment tree root) of the shielded pool.
   *
   * @return {Promise<Uint8Array>}
   */
  async getMostRecentShieldedAnchor (): Promise<Uint8Array | undefined> {
    return await getMostRecentShieldedAnchor(this.grpcPool)
  }

  /**
   * Retrieves the total balance currently held in the shielded pool.
   *
   * @return {Promise<bigint>}
   */
  async getShieldedPoolState (): Promise<bigint | undefined> {
    return await getShieldedPoolState(this.grpcPool)
  }

  /**
   * Retrieves the total count of notes (leaves) in the shielded notes
   * commitment tree. Useful as a denominator for shielded sync progress.
   *
   * @return {Promise<bigint>}
   */
  async getShieldedNotesCount (): Promise<bigint | undefined> {
    return await getShieldedNotesCount(this.grpcPool)
  }

  /**
   * Checks the spent status of the given nullifiers in the shielded pool.
   *
   * Returns an array of statuses, each containing the nullifier and whether
   * it has already been spent.
   *
   * @param nullifiers {Uint8Array[]} - nullifiers to check
   *
   * @return {Promise<ShieldedNullifierStatus[]>}
   */
  async getShieldedNullifiers (nullifiers: Uint8Array[]): Promise<ShieldedNullifierStatus[]> {
    return await getShieldedNullifiers(this.grpcPool, nullifiers)
  }

  /**
   * Recovers the notes owned by a wallet from a set of shielded encrypted notes
   * (as returned by {@link getShieldedEncryptedNotes}) by trial-decrypting each
   * with the viewing key derived from the seed (ZIP-32 m/32'/coinType'/account').
   * Only notes addressed to the wallet are returned, each with its global leaf
   * position (`index`) in the commitment tree.
   *
   * @param notes {ShieldedEncryptedNote[]} - shielded encrypted notes to scan
   * @param seed {Uint8Array} - BIP-39 seed bytes
   * @param account {number} - ZIP-32 account index
   *
   * @return {RecoveredNoteWASM[]}
   */
  recoverNotes (notes: ShieldedEncryptedNote[], seed: Uint8Array, account: number): RecoveredNoteWASM[] {
    // SLIP-44 coin type: 5 = Dash mainnet, 1 = testnets. Orchard derives via ZIP-32
    const coinType = this.grpcPool.network === 'mainnet' ? 5 : 1

    // ShieldedEncryptedNote carries everything needed for trial-decryption; the
    // spend-authorization fields (rk, spendAuthSig) are unused here, so zero them.
    const actions = notes.map(note =>
      new SerializedActionWASM(note.nullifier, new Uint8Array(32), note.cmx, note.encryptedNote, note.cvNet, new Uint8Array(64)))

    return recoverNotes(actions, seed, coinType, account)
  }

  /**
   * Rebuilds the note commitment tree from the full on-chain note set and
   * witnesses the given recovered notes against it, producing the spendable
   * notes and the shared anchor required by spend transitions (`shieldedTransfer`,
   * `unshield`, `shieldedWithdrawal`, `identityCreateFromShieldedPool`).
   *
   * Pass the complete note set from {@link getShieldedEncryptedNotes} as `notes`
   * (the commitment tree leaves) and the notes you want to spend from
   * {@link recoverNotes} as `recovered`. This keeps the whole spend flow inside
   * the SDK — no need to construct a commitment tree yourself.
   *
   * @param notes {ShieldedEncryptedNote[]} - full on-chain note set (the tree leaves)
   * @param recovered {RecoveredNoteWASM[]} - the recovered notes to spend
   *
   * @return {{ spends: SpendableNoteWASM[], anchor: Uint8Array }}
   */
  buildSpendableNotes (notes: ShieldedEncryptedNote[], recovered: RecoveredNoteWASM[]): { spends: SpendableNoteWASM[], anchor: Uint8Array } {
    // only the leaves we intend to witness need to be marked spendable
    const spendableIndices = new Set(recovered.map(note => note.index))

    const tree = new CommitmentTreeWASM()
    notes.forEach((note, index) => tree.append(note.cmx, spendableIndices.has(index)))
    tree.checkpoint(0)

    const anchor = tree.anchor()

    const spends = recovered.map(recoveredNote => {
      const merklePath = tree.witness(recoveredNote.index, 0) ?? tree.witness(recoveredNote.index, 1)

      if (merklePath == null) {
        throw new Error(`Failed to witness recovered note at index ${recoveredNote.index}`)
      }

      return new SpendableNoteWASM(recoveredNote.note, merklePath)
    })

    return { spends, anchor }
  }

  /**
   * Helper function for building and proving shielded (Orchard) transitions.
   * It may be used to create any of 6 shielded transition actions:
   *
   * 1) shield - transparent platform addresses -> pool (deposit)
   * 2) shieldFromAssetLock - asset lock -> pool (deposit)
   * 3) shieldedWithdrawal - pool -> core L1 (spend)
   * 4) unshield - pool -> platform identity balance (spend)
   * 5) shieldedTransfer - pool -> pool (spend)
   * 6) identityCreateFromShieldedPool - pool -> new identity (spend)
   *
   * Spends require a {SpendableNoteWASM} witnessed against an on-chain anchor.
   *
   * @param type {string} Type of the shielded transition, must be one of ('shield' | 'shieldFromAssetLock' | 'shieldedWithdrawal' | 'unshield' | 'shieldedTransfer' | 'identityCreateFromShieldedPool')
   * @param params {ShieldedTransitionParams} params
   *
   * @return {StateTransitionWASM}
   */
  createStateTransition<K extends ShieldedTransitionType> (
    type: K,
    params: ShieldedTransitionParamsMap[K]
  ): StateTransitionWASM {
    // @ts-expect-error a plain string memo is normalized to ShieldedMemoWASM (empty when omitted)
    params.memo = typeof params.memo === 'string' ? ShieldedMemoWASM.fromString(params.memo) : ShieldedMemoWASM.empty()

    if (type === 'identityCreateFromShieldedPool') {
      const identityParams = params as IdentityCreateFromShieldedPoolParams

      // @ts-expect-error builder expects IdentityPublicKeyInCreationWASM instances
      identityParams.publicKeys = identityParams.publicKeys
        .map(({ id, purpose, securityLevel, keyType, readOnly, data, signature, contractBounds }) =>
          new IdentityPublicKeyInCreationWASM(id, purpose, securityLevel, keyType, readOnly, data, signature, (contractBounds != null) ? new ContractBoundsWASM(contractBounds.dataContractId, contractBounds.documentType) : undefined))
    }

    return createStateTransition(this.getShieldedBuilder(), type, params)
  }
}
