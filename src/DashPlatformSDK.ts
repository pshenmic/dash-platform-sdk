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
import ContestedStateController from './contestedState'
import TokensController from './tokens'
import { initSync, wasmBase64 } from 'wasm-drive-verify'
import { base64 } from '@scure/base'
import { AbstractSigner } from './signer/AbstractSigner'

const DEFAULT_OPTIONS: { network: 'testnet' | 'mainnet', dapiUrl?: string } = {
  network: 'testnet',
  dapiUrl: undefined
}

export default class DashPlatformSDK {
  stateTransitions: StateTransitionsController
  contestedState: ContestedStateController
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

    this.stateTransitions = new StateTransitionsController(this.grpcPool)
    this.contestedState = new ContestedStateController(this.grpcPool)
    this.dataContracts = new DataContractsController(this.grpcPool)
    this.identities = new IdentitiesController(this.grpcPool)
    this.documents = new DocumentsController(this.grpcPool)
    this.tokens = new TokensController(this.grpcPool)
    this.names = new NamesController(this.grpcPool)
    this.node = new NodeController(this.grpcPool)
    this.keyPair = new KeyPairController()

    const driveVerifyWASMBytes = base64.decode(wasmBase64)

    initSync({ module: driveVerifyWASMBytes })
  }

  network: 'testnet' | 'mainnet'
  grpcPool: GRPCConnectionPool
  dpp: DashPlatformProtocolWASM
}
