import getIdentityContractNonce from './getIdentityContractNonce.js'
import getIdentityPublicKeys from './getIdentityPublicKeys.js'
import getIdentityNonce from './getIdentityNonce.js'
import getIdentityBalance from './getIdentityBalance.js'
import getIdentityByPublicKeyHash from './getIdentityByPublicKeyHash.js'
import { IdentifierLike, IdentityTransitionParams } from '../types.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import getIdentityByIdentifier from './getIdentityByIdentifier.js'
import {
  AssetLockProofWASM,
  ContractBoundsWASM, CoreScriptWASM,
  IdentifierWASM,
  IdentityPublicKeyInCreationWASM,
  IdentityPublicKeyWASM,
  IdentityWASM,
  OutPointWASM,
  PoolingWASM,
  StateTransitionWASM
} from 'pshenmic-dpp'
import createStateTransition from './createStateTransition.js'
import getIdentityByNonUniquePublicKeyHash from './getIdentityByNonUniquePublicKeyHash.js'
import hexToBytes from '../utils/hexToBytes.js'
import { base58 } from '@scure/base'

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
   * @param identifier {IdentifierLike}
   * @param keyIds {=number[]} optional, specific keyIds to request
   *
   * @return {Promise<IdentityPublicKeyWASM[]>}
   */
  async getIdentityPublicKeys (identifier: IdentifierLike, keyIds?: number[]): Promise<IdentityPublicKeyWASM[]> {
    return await getIdentityPublicKeys(this.grpcPool, identifier, keyIds)
  }

  /**
   * Helper function for creating {StateTransitionWASM} for Identity transitions
   *
   * To create an IdentityCreateTransition, you should pass a params.assetLockProof object containing
   * all necessary AssetLockProof data to make the transaction.
   * Both InstantSend and ChainLock AssetLock proofs supported
   *
   * Please refer to Identity.spec.js or README for example commands
   *
   * @param type {string} type of transition, must be a one of ('create' | 'update' | 'topUp' | 'creditTransfer' | 'withdrawal')
   * @param params {IdentityTransitionParams} params
   */
  createStateTransition (type: 'create' | 'update' | 'topUp' | 'creditTransfer' | 'withdrawal', params: IdentityTransitionParams): StateTransitionWASM {
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
      params.addPublicKeys = params.addPublicKeys
        .map(({ id, purpose, securityLevel, keyType, readOnly, data, signature, contractBounds }) =>
          new IdentityPublicKeyInCreationWASM(id, purpose, securityLevel, keyType, readOnly, data, signature, (contractBounds != null) ? new ContractBoundsWASM(contractBounds.dataContractId, contractBounds.documentType) : undefined))
    }

    if (params.publicKeys != null) {
      // @ts-expect-error
      params.publicKeys = params.publicKeys
        .map(({ id, purpose, securityLevel, keyType, readOnly, data, signature, contractBounds }) =>
          new IdentityPublicKeyInCreationWASM(id, purpose, securityLevel, keyType, readOnly, data, signature, (contractBounds != null) ? new ContractBoundsWASM(contractBounds.dataContractId, contractBounds.documentType) : undefined))
    }

    if (params.recipientId != null) {
      params.recipientId = new IdentifierWASM(params.recipientId)
    }

    if (type === 'withdrawal') {
      // @ts-expect-error
      params.pooling = params.pooling != null ? PoolingWASM[params.pooling] : PoolingWASM.Standard
      params.coreFeePerByte = params.coreFeePerByte ?? 1
      params.outputScript = params.outputScript ?? (params.withdrawalAddress != null ? CoreScriptWASM.newP2PKH(base58.decode(params.withdrawalAddress).slice(1, 21)) : undefined)
    }

    return createStateTransition(type, params)
  }
}
