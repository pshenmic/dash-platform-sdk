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

export interface SDKOptions {
  network: 'testnet' | 'mainnet'
  dapiUrl?: string | string[]
  signer?: AbstractSigner
}

/**
 * Javascript SDK for that let you interact with a Dash Platform blockchain
 */
export class DashPlatformSDK {
  network: 'testnet' | 'mainnet'
  /** @ignore **/
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
  signer?: AbstractSigner
  node: NodeController

  /**
   * Constructs a new DashPlatformSDK instance, optionally pass options
   * if you want to configure the SDK instance (network, dapiUrl, signer)
    *
   * @param options {SDKOptions=}
   */
  constructor (options?: SDKOptions) {
    if (options != null && (options.network == null || !['testnet', 'mainnet'].includes(options.network))) {
      throw new Error('If options is passed, network must be set (either mainnet or testnet)')
    }

    this.network = options?.network ?? 'testnet'
    this.signer = options?.signer

    this.utils = new UtilsController()

    this.grpcPool = new GRPCConnectionPool(this.network, options?.dapiUrl)

    this._initialize(this.grpcPool, this.network)

    const driveVerifyWASMBytes = base64.decode(wasmBase64)

    initSync({ module: driveVerifyWASMBytes })
  }

  /**
   * @private
   *
   * Internal function to initialize SDK GRPC connection pool. Is not meant to be used outside the SDK
   *
   * @param grpcPool
   * @param network
   */
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

  setSigner (signer: AbstractSigner): void {
    this.signer = signer
  }

  /**
   * Get currently used network
   *
   * @return {string}
   */
  getNetwork (): string {
    return this.network
  }

  /**
   * Switches a network that SDK is currently connected to
   *
   * @param network {string}
   */
  setNetwork (network: 'testnet' | 'mainnet'): void {
    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Unknown network, should be mainnet or testnet')
    }

    this.network = network

    const grpcPool = new GRPCConnectionPool(this.network)

    this._initialize(grpcPool, this.network)
  }
}
