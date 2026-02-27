import { DataContractTokens, DataContractWASM, PlatformVersionWASM } from 'pshenmic-dpp';
import { DataContractConfig, IdentifierLike } from '../../types.js';
export default function createDataContract(ownerId: IdentifierLike, identityNonce: bigint, schema: object, tokenConfiguration?: DataContractTokens[], config?: DataContractConfig, fullValidation?: boolean | undefined, platformVersion?: PlatformVersionWASM | undefined): DataContractWASM;
