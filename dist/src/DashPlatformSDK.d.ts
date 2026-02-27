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
import { Network } from '../types.js';
export interface GRPCOptions {
    poolLimit: 5;
    dapiUrl?: string | string[];
}
export interface SDKOptions {
    network: Network;
    grpc?: GRPCOptions;
    /** @deprecated Use {GRPCOptions} instead, will be removed in next major version **/
    dapiUrl?: string | string[];
}
/**
 * Javascript SDK for that let you interact with a Dash Platform blockchain
 */
export declare class DashPlatformSDK {
    network: Network;
    /** @ignore **/
    grpcPool: GRPCConnectionPool;
    /** @ignore **/
    options?: SDKOptions;
    contestedResources: ContestedResourcesController;
    stateTransitions: StateTransitionsController;
    dataContracts: DataContractsController;
    identities: IdentitiesController;
    documents: DocumentsController;
    keyPair: KeyPairController;
    voting: VotingController;
    tokens: TokensController;
    utils: UtilsController;
    names: NamesController;
    node: NodeController;
    /**
     * Constructs a new DashPlatformSDK instance, optionally pass options
     * if you want to configure the SDK instance (network, dapiUrl, signer)
      *
     * @param options {SDKOptions=}
     */
    constructor(options?: SDKOptions);
    /**
     * @private
     *
     * Internal function to initialize SDK GRPC connection pool. Is not meant to be used outside the SDK
     *
     * @param grpcPool
     * @param network
     */
    _initialize(grpcPool: GRPCConnectionPool, network: Network): void;
    /**
     * Get currently used network
     *
     * @return {string}
     */
    getNetwork(): string;
    /**
     * Switches a network that SDK is currently connected to
     *
     * @param network {string}
     */
    setNetwork(network: Network): void;
}
