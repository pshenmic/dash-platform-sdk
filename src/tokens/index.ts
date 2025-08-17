import GRPCConnectionPool from '../grpcConnectionPool'
import { IdentifierLike, TokenTransitionParams, TokenTransitionType } from '../types'
import getIdentitiesTokenBalances, { IdentitiesTokenBalances } from './getIdentitiesTokenBalances'
import getIdentityTokensBalances, { IdentityTokenBalances } from './getIdentityTokensBalances'
import getTokenContractInfo, { TokenContractInfo } from './getTokenContractInfo'
import getTokenTotalSupply, { TokenTotalSupply } from './getTokenTotalSupply'
import createStateTransition from './createStateTransition'
import { IdentifierWASM, StateTransitionWASM, TokenBaseTransitionWASM } from 'pshenmic-dpp'
import getIdentityContractNonce from '../identities/getIdentityContractNonce'

/**
 * Tokens controller for requesting information about tokens and tokens holders
 *
 * @hideconstructor
 */
export default class TokensController {
  /** @ignore **/
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  /**
   * Retrieves a token balances for identities
   *
   * @param identifiers {IdentifierLike[]} - list of identifiers which balance we need to get
   * @param tokenIdentifier {IdentifierLike} - token identifier
   *
   * @return {Promise<IdentitiesTokenBalances>}
   */
  async getIdentitiesTokenBalances (identifiers: IdentifierLike[], tokenIdentifier: IdentifierLike): Promise<IdentitiesTokenBalances[]> {
    return await getIdentitiesTokenBalances(this.grpcPool, identifiers, tokenIdentifier)
  }

  /**
   * Retrieves a tokens balances for identity
   *
   * @param identifier {IdentifierLike} - identifier which balance we need to get
   * @param tokenIdentifiers {IdentifierLike[]} - list of tokens ids which used in request
   *
   * @return {Promise<IdentityTokenBalances>}
   */
  async getIdentityTokensBalances (identifier: IdentifierLike, tokenIdentifiers: IdentifierLike[]): Promise<IdentityTokenBalances[]> {
    return await getIdentityTokensBalances(this.grpcPool, identifier, tokenIdentifiers)
  }

  /**
   * Retrieves a tokens contract info by id
   *
   * @param tokenIdentifier {IdentifierLike} - token id which contract info we need
   *
   * @return {Promise<TokenContractInfo>}
   */
  async getTokenContractInfo (tokenIdentifier: IdentifierLike): Promise<TokenContractInfo> {
    return await getTokenContractInfo(this.grpcPool, tokenIdentifier)
  }

  /**
   * Retrieves a token total supply
   *
   * @param tokenIdentifier {IdentifierLike} - token id which total supply we need
   *
   * @return {Promise<TokenTotalSupply>}
   */
  async getTokenTotalSupply (tokenIdentifier: IdentifierLike): Promise<TokenTotalSupply> {
    return await getTokenTotalSupply(this.grpcPool, tokenIdentifier)
  }

  /**
   * Creates a Token Base Transition that contains base information about token transition
   *
   * @param tokenId {IdentifierLike} - token identifier
   * @param ownerId {IdentifierLike} - identity identifier of sender of the transaction
   *
   * @return {TokenBaseTransitionWASM}
   */
  async createBaseTransition (tokenId: IdentifierLike, ownerId: IdentifierLike): Promise<TokenBaseTransitionWASM> {
    const { dataContractId, tokenContractPosition } = await getTokenContractInfo(this.grpcPool, tokenId)
    const identityContractNonce = await getIdentityContractNonce(this.grpcPool, ownerId, dataContractId)

    return new TokenBaseTransitionWASM(identityContractNonce + BigInt(1), tokenContractPosition, dataContractId, tokenId, undefined)
  }

  /**
   * Helper function for creation of a token state transition to be broadcasted in the network
   *
   * You have to pass token base transition acquired from .createBaseTransition() method
   * together with token transition type and its params
   *
   * @param base {TokenBaseTransitionWASM} - token Base transition
   * @param ownerId {IdentifierLike} - `identity identifier of the owner of the transaction`
   * @param type {TokenTransitionType} - token transition type as string (f.e. 'transfer')
   * @param params {TokenTransitionParams} - params required for a token transition
   *
   * @return {StateTransitionWASM}
   */
  createStateTransition (base: TokenBaseTransitionWASM, ownerId: IdentifierLike, type: TokenTransitionType, params: TokenTransitionParams): StateTransitionWASM {
    const owner = new IdentifierWASM(ownerId)

    if (params.identityId != null) {
      params.identityId = new IdentifierWASM(params.identityId)
    }

    return createStateTransition(base, owner, type, params)
  }
}
