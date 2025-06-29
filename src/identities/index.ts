import getIdentityContractNonce from "./getIdentityContractNonce";
import getIdentityPublicKeys from "./getIdentityPublicKeys";
import getIdentityNonce from "./getIdentityNonce";
import getIdentityBalance from "./getIdentityBalance";
import getIdentityByPublicKeyHash from "./getIdentityByPublicKeyHash";
import {IdentifierLike} from "../types";

export class IdentitiesController {

    getIdentityBalance(identifier: IdentifierLike) {
        return getIdentityBalance(identifier)
    }

    getIdentityByPublicKeyHash(hex: string) {
        return getIdentityByPublicKeyHash(hex)
    }

    getIdentityNonce(identifier: IdentifierLike) {
        return getIdentityNonce(identifier)
    }

    getIdentityContractNonce(identifier: IdentifierLike, dataContract: IdentifierLike) {
        return getIdentityContractNonce(identifier, dataContract)
    }

    getIdentityPublicKeys(identifier: IdentifierLike) {
        return getIdentityPublicKeys(identifier)
    }

}
