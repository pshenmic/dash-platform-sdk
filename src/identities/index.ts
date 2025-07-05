import getIdentityContractNonce from './getIdentityContractNonce'
import getIdentityPublicKeys from './getIdentityPublicKeys'
import getIdentityNonce from './getIdentityNonce'
import getIdentityBalance from './getIdentityBalance'
import getIdentityByPublicKeyHash from './getIdentityByPublicKeyHash'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { UtilsController } from '../utils'
import getIdentityByIdentifier from './getIdentityByIdentifier'
import { IdentityPublicKeyWASM, IdentityWASM } from 'pshenmic-dpp'

export class IdentitiesController {
  grpcPool: GRPCConnectionPool
  utils: UtilsController

  constructor (grpcPool: GRPCConnectionPool, utils: UtilsController) {
    this.grpcPool = grpcPool
    this.utils = utils
  }

  async getIdentityBalance (identifier: IdentifierLike): Promise<bigint> {
    return await getIdentityBalance(this.grpcPool, identifier)
  }

  async getIdentityByPublicKeyHash (hex: string): Promise<IdentityWASM> {
    return await getIdentityByPublicKeyHash(this.grpcPool, this.utils, hex)
  }

  async getIdentityByIdentifier (identifier: IdentifierLike): Promise<IdentityWASM> {
    return await getIdentityByIdentifier(this.grpcPool, identifier)
  }

  async getIdentityNonce (identifier: IdentifierLike): Promise<bigint> {
    return await getIdentityNonce(this.grpcPool, identifier)
  }

  async getIdentityContractNonce (identifier: IdentifierLike, dataContract: IdentifierLike): Promise<bigint> {
    return await getIdentityContractNonce(this.grpcPool, identifier, dataContract)
  }

  async getIdentityPublicKeys (identifier: IdentifierLike): Promise<IdentityPublicKeyWASM[]> {
    return await getIdentityPublicKeys(this.grpcPool, identifier)
  }
}
