import {DataContractConfig, IdentifierLike} from "../types";
import createDocument from "./create";
import getByIdentifier from "./getByIdentifier";
import {PlatformVersionWASM} from "pshenmic-dpp";

export class DataContractsController {
    create(ownerId: IdentifierLike, identityNonce: bigint, schema: object, definitions?: object, fullValidation: boolean | undefined = true, config?: DataContractConfig, platformVersion: PlatformVersionWASM | undefined = PlatformVersionWASM.PLATFORM_V1) {
        return createDocument(ownerId, identityNonce, schema, definitions, fullValidation, config, platformVersion);
    }

    getByIdentifier(identifier: IdentifierLike) {
        return getByIdentifier(identifier)
    }
}
