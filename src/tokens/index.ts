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
   * Creates a token state transition
   *
   * @param tokenId {IdentifierLike} - token id which total supply we need
   * @param ownerId {IdentifierLike} - token id which total supply we need
   *
   * @return {TokenBaseTransitionWASM}
   */
  async createBaseTransition (tokenId: IdentifierLike, ownerId: IdentifierLike): Promise<TokenBaseTransitionWASM> {
    const { dataContractId, tokenContractPosition } = await getTokenContractInfo(this.grpcPool, tokenId)
    const identityContractNonce = await getIdentityContractNonce(this.grpcPool, ownerId, dataContractId)

    return new TokenBaseTransitionWASM(identityContractNonce, tokenContractPosition, dataContractId, tokenId, undefined)
  }

  /**
   * Creates a token state transition
   *
   * @param base {TokenBaseTransitionWASM} - token id which total supply we need
   * @param ownerId {IdentifierLike} - token id which total supply we need
   * @param type {TokenTransitionType} - token id which total supply we need
   * @param params {TokenTransitionParams} - token id which total supply we need
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
