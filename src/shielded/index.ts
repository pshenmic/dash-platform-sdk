import GRPCConnectionPool from '../grpcConnectionPool.js'
import {
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
import { ShieldedBuilderWASM, StateTransitionWASM } from 'pshenmic-dpp'

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
    return createStateTransition(this.getShieldedBuilder(), type, params)
  }
}
