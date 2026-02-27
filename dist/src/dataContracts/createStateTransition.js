import { DataContractCreateTransitionWASM, DataContractUpdateTransitionWASM } from 'pshenmic-dpp';
export var DataContractTransitionType;
(function (DataContractTransitionType) {
    DataContractTransitionType[DataContractTransitionType["Create"] = 0] = "Create";
    DataContractTransitionType[DataContractTransitionType["Update"] = 1] = "Update";
})(DataContractTransitionType || (DataContractTransitionType = {}));
const dataContractTransitionsMap = {
    create: DataContractCreateTransitionWASM,
    update: DataContractUpdateTransitionWASM
};
export default function createStateTransition(dataContract, type, identityNonce) {
    const TransitionClass = dataContractTransitionsMap[type];
    if (TransitionClass == null) {
        throw new Error(`Unknown DataContract transition type: ${type}. Should be 'create' or 'update'.`);
    }
    const dataContractTransition = new TransitionClass(dataContract, identityNonce);
    return dataContractTransition.toStateTransition();
}
