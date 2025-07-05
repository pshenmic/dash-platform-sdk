import { DataContractConfig, IdentifierLike } from '../types'
import getByIdentifier from './getByIdentifier'
import { DataContractWASM, PlatformVersionWASM, StateTransitionWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from '../grpcConnectionPool'
import createDataContract from './create'
import createStateTransition, { DataContractTransitionType } from './createStateTransition'

export class DataContractsController {
  grpcPool: GRPCConnectionPool

  constructor (grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }

  async create (ownerId: IdentifierLike, identityNonce: bigint, schema: object, definitions?: object, fullValidation: boolean | undefined = true, tokenConfiguration?: object, config?: DataContractConfig, platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1): Promise<DataContractWASM> {
    return await createDataContract(ownerId, identityNonce, schema, definitions, tokenConfiguration, config, fullValidation, platformVersion)
  }

  async getByIdentifier (identifier: IdentifierLike): Promise<DataContractWASM> {
    return await getByIdentifier(this.grpcPool, identifier)
  }

  async createStateTransition (dataContract: DataContractWASM, type: DataContractTransitionType, identityContractNonce: bigint): Promise<StateTransitionWASM> {
    return await createStateTransition(dataContract, type, identityContractNonce)
  }
}
