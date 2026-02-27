export { CoreScriptWASM, DocumentWASM, IdentifierWASM, TokenPricingScheduleWASM, StateTransitionWASM, BatchTransitionWASM, IdentityPublicKeyWASM, PrivateKeyWASM, DataContractUpdateTransitionWASM, IdentityWASM, IdentityUpdateTransitionWASM, IdentityCreditTransferWASM, MasternodeVoteTransitionWASM } from 'pshenmic-dpp';
export { DashPlatformSDK } from './src/DashPlatformSDK.js';
export var ContestedStateResultType;
(function (ContestedStateResultType) {
    ContestedStateResultType[ContestedStateResultType["DOCUMENTS"] = 0] = "DOCUMENTS";
    ContestedStateResultType[ContestedStateResultType["VOTE_TALLY"] = 1] = "VOTE_TALLY";
    ContestedStateResultType[ContestedStateResultType["DOCUMENTS_AND_VOTE_TALLY"] = 2] = "DOCUMENTS_AND_VOTE_TALLY";
})(ContestedStateResultType || (ContestedStateResultType = {}));
export var FinishedVoteOutcome;
(function (FinishedVoteOutcome) {
    FinishedVoteOutcome[FinishedVoteOutcome["TOWARDS_IDENTITY"] = 0] = "TOWARDS_IDENTITY";
    FinishedVoteOutcome[FinishedVoteOutcome["LOCKED"] = 1] = "LOCKED";
    FinishedVoteOutcome[FinishedVoteOutcome["NO_PREVIOUS_WINNER"] = 2] = "NO_PREVIOUS_WINNER";
    FinishedVoteOutcome[FinishedVoteOutcome["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(FinishedVoteOutcome || (FinishedVoteOutcome = {}));
