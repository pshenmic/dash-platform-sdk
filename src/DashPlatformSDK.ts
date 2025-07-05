import { DashPlatformProtocolWASM } from 'pshenmic-dpp'
import GRPCConnectionPool from './grpcConnectionPool'
import { IdentitiesController } from './identities'
import { StateTransitionsController } from './stateTransitions'
import { DocumentsController } from './documents'
import { UtilsController } from './utils'
import { KeyPairController } from './keyPair'
import { NodeController } from './node'
import { NamesController } from './names'
import { DataContractsController } from './dataContracts'

const DEFAULT_OPTIONS: { network: 'testnet' | 'mainnet', dapiUrl?: string } = {
  network: 'testnet',
  dapiUrl: undefined
}

export default class DashPlatformSDK {
  utils: UtilsController
  identities: IdentitiesController
  documents: DocumentsController
  stateTransitions: StateTransitionsController
  keyPair: KeyPairController
  node: NodeController
  dataContracts: DataContractsController
  names: NamesController

  constructor (options: { network: 'testnet' | 'mainnet', dapiUrl?: string } = DEFAULT_OPTIONS) {
    this.network = options.network

    this.utils = new UtilsController()

    this.grpcPool = new GRPCConnectionPool(this.network, this.utils, options.dapiUrl)

    this.stateTransitions = new StateTransitionsController(this.grpcPool)
    this.identities = new IdentitiesController(this.grpcPool, this.utils)
    this.dataContracts = new DataContractsController(this.grpcPool)
    this.documents = new DocumentsController(this.grpcPool)
    this.names = new NamesController(this.grpcPool)
    this.node = new NodeController(this.grpcPool)
    this.keyPair = new KeyPairController()
  }

  network: 'testnet' | 'mainnet'
  grpcPool: GRPCConnectionPool
  dpp: DashPlatformProtocolWASM
}
