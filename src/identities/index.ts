import getIdentityContractNonce from './getIdentityContractNonce'
import getIdentityPublicKeys from './getIdentityPublicKeys'
import getIdentityNonce from './getIdentityNonce'
import getIdentityBalance from './getIdentityBalance'
import getIdentityByPublicKeyHash from './getIdentityByPublicKeyHash'
import { IdentifierLike, IdentityTransitionParams } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import getIdentityByIdentifier from './getIdentityByIdentifier'
import {
  AssetLockProofWASM,
  IdentifierWASM, IdentityPublicKeyInCreationWASM,
  IdentityPublicKeyWASM,
  IdentityWASM,
  OutPointWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import createStateTransition from './createStateTransition'
import getIdentityByNonUniquePublicKeyHash from './getIdentityByNonUniquePublicKeyHash'
import hexToBytes from '../utils/hexToBytes'

/**
 * Collection of methods to query identities and its related data
 *
 * @hideconstructor
 */
export class IdentitiesController {
  /** @ignore */
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Get current balance of your Identity by identifier
   *
   * @param identifier {IdentifierLike} Identifier of an identity
   *
   * @return {Promise<bigint>}
   */
  async getIdentityBalance (identifier: IdentifierLike): Promise<bigint> {
    return await getIdentityBalance(this.grpcPool, identifier)
  }

  /**
   * Retrieves an Identity from the network by give public key hash
   *
   * @param hex {string} public key hash value in hex, should be a length of 40
   *
   * @return {Promise<IdentityWASM>}
   */
  async getIdentityByPublicKeyHash (hex: string): Promise<IdentityWASM> {
    if (hex.length !== 40) {
      throw new Error('Public key hash should equal 40')
    }

    return await getIdentityByPublicKeyHash(this.grpcPool, hex)
  }

  /**
   * Retrieves an Identity from the network by non-unique public key hash (like Voter Identity, SHA160)
   *
   * @param hex {string} public key hash value in hex, should be a length of 40
   *
   * @return {Promise<IdentityWASM>}
   */
  async getIdentityByNonUniquePublicKeyHash (hex: string): Promise<IdentityWASM> {
    if (hex.length !== 40) {
      throw new Error('Public key hash should equal 40')
    }

    return await getIdentityByNonUniquePublicKeyHash(this.grpcPool, hex)
  }

  /**
   * Retrieves Identity by identifier from the network
   * @param identifier {IdentifierLike} identifier
   *
   * @return {Promise<IdentityWASM>}
   */
  async getIdentityByIdentifier (identifier: IdentifierLike): Promise<IdentityWASM> {
    return await getIdentityByIdentifier(this.grpcPool, identifier)
  }

  /**
   * Get Identity Nonce (usually used by Identity transitions)
   * @param identifier
   */
  async getIdentityNonce (identifier: IdentifierLike): Promise<bigint> {
    return await getIdentityNonce(this.grpcPool, identifier)
  }

  /**
   * Get Identity Contract Nonce (usually used by Document transitions)
   * @param identifier
   * @param dataContract
   *
   * @return {Promise<bigint>}
   */
  async getIdentityContractNonce (identifier: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
    return await getIdentityContractNonce(this.grpcPool, identifier, dataContract)
  }

  /**
   * Retrieve given Identity's public keys
   * @param identifier
   *
   * @return {Promise<IdentityPublicKeyWASM[]>}
   */
  async getIdentityPublicKeys (identifier: IdentifierLike): Promise<IdentityPublicKeyWASM[]> {
    return await getIdentityPublicKeys(this.grpcPool, identifier)
  }

  /**
   * Helper function for creating {StateTransitionWASM} for Identity transitions
   *
   * @param type {string} type of transition, must be a one of ('create' | 'update' | 'topUp')
   * @param params {IdentityTransitionParams} params
   */
  createStateTransition (type: 'create' | 'update' | 'topUp', params: IdentityTransitionParams): StateTransitionWASM {
    if (params.identityId != null) {
      params.identityId = new IdentifierWASM(params.identityId)
    }

    if (params.disablePublicKeyIds == null) {
      params.disablePublicKeyIds = []
    }

    if (params.assetLockProof != null) {
      const { type } = params.assetLockProof

      if (type === 'chainLock') {
        const { txid, outputIndex, coreChainLockedHeight } = params.assetLockProof

        // @ts-expect-error
        params.assetLockProof = AssetLockProofWASM.createChainAssetLockProof(coreChainLockedHeight, new OutPointWASM(txid, outputIndex))
      } else if (type === 'instantLock') {
        const { transaction, outputIndex, instantLock } = params.assetLockProof

        // @ts-expect-error
        params.assetLockProof = AssetLockProofWASM.createInstantAssetLockProof(hexToBytes(instantLock), hexToBytes(transaction), outputIndex)
      } else if (type == null) {
        throw new Error('Missing Asset Lock type in the params')
      } else {
        throw new Error(`Unknown Asset Lock type: ${type as string}`)
      }
    }

    if (params.addPublicKeys != null) {
      // @ts-expect-error
      params.addPublicKeys = params.addPublicKeys.map(({ id, purpose, securityLevel, keyType, readOnly, data, signature }) => new IdentityPublicKeyInCreationWASM(id, purpose, securityLevel, keyType, readOnly, data, signature))
    }

    if (params.publicKeys != null) {
      // @ts-expect-error
      params.publicKeys = params.publicKeys.map(({ id, purpose, securityLevel, keyType, readOnly, data, signature }) => new IdentityPublicKeyInCreationWASM(id, purpose, securityLevel, keyType, readOnly, data, signature))
    }

    return createStateTransition(type, params)
  }
}
