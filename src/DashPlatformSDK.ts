import GRPCConnectionPool, { GRPCOptions, GRPCPool } from './grpcConnectionPool.js'
import { IdentitiesController } from './identities/index.js'
import { StateTransitionsController } from './stateTransitions/index.js'
import { DocumentsController } from './documents/index.js'
import { UtilsController } from './utils/index.js'
import { KeyPairController } from './keyPair/index.js'
import { NodeController } from './node/index.js'
import { NamesController } from './names/index.js'
import { DataContractsController } from './dataContracts/index.js'
import { ContestedResourcesController } from './contestedResources/index.js'
import { TokensController } from './tokens/index.js'
import { VotingController } from './voting/index.js'
import { Network } from '../types.js'
import { PlatformAddressesController } from './platformAddresses/index.js'
import { ShieldedController } from './shielded/index.js'
import { PlatformExplorerQuorumKeyProvider, QuorumKeyProvider } from './quorumKeyProvider.js'

export type { GRPCOptions, GRPCPool, QuorumKeyProvider }

export interface SDKOptions {
  network: Network
  grpc?: GRPCOptions
  /** Custom source of quorum public keys for proof verification, Platform Explorer is used if not set **/
  quorumKeyProvider?: QuorumKeyProvider
  /**
   * Requests and verifies proofs of the queries (default `true`).
   * Without proofs, responses are trusted as is, queries that can not be done without proofs are still requested with proofs.
   * Overrides `proofs` of a custom GRPC pool
   */
  proofs?: boolean
  /** @deprecated Use {GRPCOptions} instead, will be removed in next major version **/
  dapiUrl?: string | string[]
}

/**
 * Javascript SDK for that let you interact with a Dash Platform blockchain
 */
export class DashPlatformSDK {
  network: Network
  /** @ignore **/
  grpcPool: GRPCPool
  /** @ignore **/
  quorumKeyProvider: QuorumKeyProvider
  /** @ignore **/
  options?: SDKOptions

  contestedResources: ContestedResourcesController
  platformAddresses: PlatformAddressesController
  shielded: ShieldedController
  stateTransitions: StateTransitionsController
  dataContracts: DataContractsController
  identities: IdentitiesController
  documents: DocumentsController
  keyPair: KeyPairController
  voting: VotingController
  tokens: TokensController
  utils: UtilsController
  names: NamesController
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

    this.network = options?.network ?? 'mainnet'
    this.options = options

    this.utils = new UtilsController()

    // Compatibility
    if (options?.dapiUrl != null && ((options?.grpc) == null)) {
      // @ts-expect-error
      this.options.grpc = { dapiUrl: options.dapiUrl }
    }

    const customPool = this.options?.grpc?.pool

    if (customPool != null && customPool.network !== this.network) {
      throw new Error(`Custom GRPC pool network (${customPool.network}) does not match SDK network (${this.network})`)
    }

    this._initialize(customPool ?? new GRPCConnectionPool(this.network, this.options?.grpc))
  }

  /**
   * @private
   *
   * Internal function to initialize SDK GRPC connection pool. Is not meant to be used outside the SDK
   *
   * @param grpcPool
   * @param network
   */
  _initialize (grpcPool: GRPCPool): void {
    if (this.options?.proofs != null) {
      grpcPool.proofs = this.options.proofs
    }

    const quorumKeyProvider = this.options?.quorumKeyProvider ?? new PlatformExplorerQuorumKeyProvider(grpcPool.network)

    this.grpcPool = grpcPool
    this.quorumKeyProvider = quorumKeyProvider

    this.contestedResources = new ContestedResourcesController(grpcPool, quorumKeyProvider)
    this.platformAddresses = new PlatformAddressesController(grpcPool, quorumKeyProvider)
    this.shielded = new ShieldedController(grpcPool, quorumKeyProvider)
    this.stateTransitions = new StateTransitionsController(grpcPool, quorumKeyProvider)
    this.dataContracts = new DataContractsController(grpcPool, quorumKeyProvider)
    this.identities = new IdentitiesController(grpcPool, quorumKeyProvider)
    this.documents = new DocumentsController(grpcPool, quorumKeyProvider)
    this.voting = new VotingController()
    this.node = new NodeController(grpcPool, quorumKeyProvider)
    this.tokens = new TokensController(grpcPool, quorumKeyProvider)
    this.names = new NamesController(grpcPool, quorumKeyProvider)
    this.keyPair = new KeyPairController()
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
  setNetwork (network: Network): void {
    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Unknown network, should be mainnet or testnet')
    }

    const customPool = this.options?.grpc?.pool

    if (customPool != null && customPool.network !== network) {
      throw new Error(`Custom GRPC pool is bound to ${customPool.network}, pass a pool for ${network} with setGRPCPool() instead`)
    }

    this.network = network

    this._initialize(customPool ?? new GRPCConnectionPool(this.network, this.options?.grpc))
  }

  /**
   * Replaces source of quorum public keys used for proof verification.
   * Pass nothing to switch back to Platform Explorer
   *
   * @param quorumKeyProvider {QuorumKeyProvider=}
   */
  setQuorumKeyProvider (quorumKeyProvider?: QuorumKeyProvider): void {
    this.options = { ...(this.options ?? { network: this.network }), quorumKeyProvider }

    this._initialize(this.grpcPool)
  }

  /**
   * Replaces GRPC connection pool used by the SDK with a custom one.
   * SDK network is switched to the pool's network
   *
   * @param grpcPool {GRPCPool}
   */
  setGRPCPool (grpcPool: GRPCPool): void {
    if (grpcPool.network !== 'testnet' && grpcPool.network !== 'mainnet') {
      throw new Error('Unknown GRPC pool network, should be mainnet or testnet')
    }

    this.network = grpcPool.network
    this.options = { ...(this.options ?? { network: grpcPool.network }), network: grpcPool.network, grpc: { ...this.options?.grpc, pool: grpcPool } }

    this._initialize(grpcPool)
  }
}
