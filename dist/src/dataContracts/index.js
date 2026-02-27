import getDataContractByIdentifier from './getDataContractByIdentifier.js';
import createDataContract from './create.js';
import createStateTransition from './createStateTransition.js';
/**
 * Collection of methods necessary to work with Data Contracts in the network,
 * such as data contract creation or retrieval
 *
 * @hideconstructor
 */
export class DataContractsController {
    /** @ignore */
    grpcPool;
    constructor(grpcPool) {
        this.grpcPool = grpcPool;
    }
    /**
     * Creates an instance of {DataContractWASM} that can be used to
     * register a data contract in the network.
     *
     * @param ownerId {IdentifierLike} Identifier of the Data Contract's owner
     * @param identityNonce {bigint} Identity nonce
     * @param schema {object} Data Contract schema in json
     * @param tokenConfiguration {object=} Token configuration
     * @param config {DataContractConfig=} Data Contract config
     * @param fullValidation {true=} Full validation (omit it)
     * @param platformVersion {PlatformVersionWASM=} version of the platform
     *
     * @return {DataContractWASM}
     */
    create(ownerId, identityNonce, schema, fullValidation, tokenConfiguration, config, platformVersion) {
        return createDataContract(ownerId, identityNonce, schema, tokenConfiguration, config, fullValidation, platformVersion);
    }
    /**
     * Retrieves a Data Contract by an identifier from the network
     *
     * @param identifier {IdentifierLike} Identifier of the Data Contract
     *
     * @return {Promise<DataContractWASM>}
     */
    async getDataContractByIdentifier(identifier) {
        return await getDataContractByIdentifier(this.grpcPool, identifier);
    }
    /**
     * Helper function to create a state transition from a {DataContractWASM} instance
     * Pass {DataContractTransitionType} in type param to specify which type of operation you want
     * to make: create or update.
     *
     * @param dataContract {DataContractWASM} An instance of DataContractWASM to create or update
     * @param type {string} type of identity state transition to do, must be 'create' or 'update'
     * @param identityNonce {bigint} identity contract nonce
     *
     * @return {StateTransitionWASM}
     */
    createStateTransition(dataContract, type, identityNonce) {
        return createStateTransition(dataContract, type, identityNonce);
    }
}
