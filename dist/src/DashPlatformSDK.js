import GRPCConnectionPool from './grpcConnectionPool.js';
import { IdentitiesController } from './identities/index.js';
import { StateTransitionsController } from './stateTransitions/index.js';
import { DocumentsController } from './documents/index.js';
import { UtilsController } from './utils/index.js';
import { KeyPairController } from './keyPair/index.js';
import { NodeController } from './node/index.js';
import { NamesController } from './names/index.js';
import { DataContractsController } from './dataContracts/index.js';
import { ContestedResourcesController } from './contestedResources/index.js';
import { TokensController } from './tokens/index.js';
import { VotingController } from './voting/index.js';
/**
 * Javascript SDK for that let you interact with a Dash Platform blockchain
 */
export class DashPlatformSDK {
    network;
    /** @ignore **/
    grpcPool;
    /** @ignore **/
    options;
    contestedResources;
    stateTransitions;
    dataContracts;
    identities;
    documents;
    keyPair;
    voting;
    tokens;
    utils;
    names;
    node;
    /**
     * Constructs a new DashPlatformSDK instance, optionally pass options
     * if you want to configure the SDK instance (network, dapiUrl, signer)
      *
     * @param options {SDKOptions=}
     */
    constructor(options) {
        if (options != null && (options.network == null || !['testnet', 'mainnet'].includes(options.network))) {
            throw new Error('If options is passed, network must be set (either mainnet or testnet)');
        }
        this.network = options?.network ?? 'mainnet';
        this.options = options;
        this.utils = new UtilsController();
        // Compatibility
        if (options?.dapiUrl != null && ((options?.grpc) == null)) {
            // @ts-expect-error
            this.options.grpc = { dapiUrl: options.dapiUrl };
        }
        this.grpcPool = new GRPCConnectionPool(this.network, this.options?.grpc);
        this._initialize(this.grpcPool, this.network);
    }
    /**
     * @private
     *
     * Internal function to initialize SDK GRPC connection pool. Is not meant to be used outside the SDK
     *
     * @param grpcPool
     * @param network
     */
    _initialize(grpcPool, network) {
        this.grpcPool = grpcPool;
        this.stateTransitions = new StateTransitionsController(grpcPool);
        this.contestedResources = new ContestedResourcesController(grpcPool);
        this.dataContracts = new DataContractsController(grpcPool);
        this.identities = new IdentitiesController(grpcPool);
        this.documents = new DocumentsController(grpcPool);
        this.voting = new VotingController();
        this.node = new NodeController(grpcPool, network);
        this.tokens = new TokensController(grpcPool);
        this.names = new NamesController(grpcPool);
        this.keyPair = new KeyPairController();
    }
    /**
     * Get currently used network
     *
     * @return {string}
     */
    getNetwork() {
        return this.network;
    }
    /**
     * Switches a network that SDK is currently connected to
     *
     * @param network {string}
     */
    setNetwork(network) {
        if (network !== 'testnet' && network !== 'mainnet') {
            throw new Error('Unknown network, should be mainnet or testnet');
        }
        this.network = network;
        const grpcPool = new GRPCConnectionPool(this.network, this.options?.grpc);
        this._initialize(grpcPool, this.network);
    }
}
