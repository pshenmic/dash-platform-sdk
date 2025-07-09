import GRPCConnectionPool from './grpcConnectionPool'
import { IdentitiesController } from './identities'
import { StateTransitionsController } from './stateTransitions'
import { DocumentsController } from './documents'
import { UtilsController } from './utils'
import { KeyPairController } from './keyPair'
import { NodeController } from './node'
import { NamesController } from './names'
import { DataContractsController } from './dataContracts'
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

  utils: UtilsController
  identities: IdentitiesController
  documents: DocumentsController
  stateTransitions: StateTransitionsController
  keyPair: KeyPairController
  node: NodeController
  dataContracts: DataContractsController
  names: NamesController
  signer?: AbstractSigner

  constructor (options: { network: 'testnet' | 'mainnet', dapiUrl?: string, signer?: AbstractSigner } = DEFAULT_OPTIONS) {
    this.network = options.network
    this.signer = options.signer

    this.utils = new UtilsController()

    this.grpcPool = new GRPCConnectionPool(this.network, options.dapiUrl)

    this._initialize(this.grpcPool)

    const driveVerifyWASMBytes = base64.decode(wasmBase64)

    initSync({ module: driveVerifyWASMBytes })
  }

  _initialize (grpcPool: GRPCConnectionPool): void {
    this.stateTransitions = new StateTransitionsController(grpcPool)
    this.dataContracts = new DataContractsController(grpcPool)
    this.identities = new IdentitiesController(grpcPool)
    this.documents = new DocumentsController(grpcPool)
    this.names = new NamesController(grpcPool)
    this.node = new NodeController(grpcPool)
    this.keyPair = new KeyPairController()
  }

  setSigner(signer: AbstractSigner): void {
    this.signer = signer
  }

  setNetwork (network: 'testnet' | 'mainnet'): void {
    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Unknown network, should be mainnet or testnet')
    }

    this.network = network

    const grpcPool = new GRPCConnectionPool(this.network)

    this._initialize(grpcPool)
  }
}
