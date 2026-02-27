import { DataContractWASM, IdentifierWASM } from 'pshenmic-dpp';
import { LATEST_PLATFORM_VERSION } from '../constants.js';
export default function createDataContract(ownerId, identityNonce, schema, tokenConfiguration, config, fullValidation, platformVersion) {
    const id = new IdentifierWASM(ownerId);
    const dataContract = new DataContractWASM(id, identityNonce, schema, 
    // we don't know what that param means yet
    undefined, tokenConfiguration, fullValidation ?? true, platformVersion ?? LATEST_PLATFORM_VERSION);
    if (config != null) {
        dataContract.setConfig(config, platformVersion);
    }
    return dataContract;
}
