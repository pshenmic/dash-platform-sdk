import {
    StateTransitionWASM
} from "pshenmic-dpp";
import waitForStateTransitionResult from "./waitForStateTransitionResult";
import broadcast from "./broadcast";


export class StateTransitionsController {
    broadcast(stateTransition: StateTransitionWASM) {
        return broadcast(stateTransition);
    }

    waitForStateTransitionResult(stateTransition: StateTransitionWASM) {
        return waitForStateTransitionResult(stateTransition)
    }


}
