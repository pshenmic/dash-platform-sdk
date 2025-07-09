import GRPCConnectionPool from './grpcConnectionPool'
import { IdentitiesController } from './identities'
import { StateTransitionsController } from './stateTransitions'
import { DocumentsController } from './documents'
import { UtilsController } from './utils'
import { KeyPairController } from './keyPair'
import { NodeController } from './node'
import { NamesController } from './names'
import { DataContractsController } from './dataContracts'
import ContestedResourcesController from './contestedResources'
import TokensController from './tokens'
import { initSync, wasmBase64 } from 'wasm-drive-verify'
import { base64 } from '@scure/base'
import { AbstractSigner } from './signer/AbstractSigner'

const DEFAULT_OPTIONS: { network: 'testnet' | 'mainnet', dapiUrl?: string } = {
  network: 'testnet',
  dapiUrl: undefined
}

export class DashPlatformSDK {
  network: 'testnet' | 'mainnet'
  grpcPool: GRPCConnectionPool

  contestedResources: ContestedResourcesController
  stateTransitions: StateTransitionsController
  dataContracts: DataContractsController
  identities: IdentitiesController
  documents: DocumentsController
  keyPair: KeyPairController
  tokens: TokensController
  utils: UtilsController
  names: NamesController
  node: NodeController
  signer: AbstractSigner

  constructor (options: { network: 'testnet' | 'mainnet', dapiUrl?: string } = DEFAULT_OPTIONS) {
    this.network = options.network

    this.utils = new UtilsController()

    this.grpcPool = new GRPCConnectionPool(this.network, options.dapiUrl)

    this._initialize(this.grpcPool, this.network)

    const driveVerifyWASMBytes = base64.decode(wasmBase64)

    initSync({ module: driveVerifyWASMBytes })
  }

  _initialize (grpcPool: GRPCConnectionPool, network: 'testnet' | 'mainnet'): void {
    this.stateTransitions = new StateTransitionsController(grpcPool)
    this.contestedResources = new ContestedResourcesController(grpcPool)
    this.dataContracts = new DataContractsController(grpcPool)
    this.identities = new IdentitiesController(grpcPool)
    this.documents = new DocumentsController(grpcPool)
    this.node = new NodeController(grpcPool, network)
    this.tokens = new TokensController(grpcPool)
    this.names = new NamesController(grpcPool)
    this.keyPair = new KeyPairController()
  }

  setNetwork (network: 'testnet' | 'mainnet'): void {
    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Unknown network, should be mainnet or testnet')
    }

    this.network = network

    const grpcPool = new GRPCConnectionPool(this.network)

    this._initialize(grpcPool, this.network)
  }
}
