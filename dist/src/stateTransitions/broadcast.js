import { BroadcastStateTransitionRequest } from '../../proto/generated/platform.js';
export default async function broadcast(grpcPool, stateTransition) {
    if (stateTransition.signature?.length === 0) {
        throw new Error('State Transition is not signed');
    }
    const broadcastStateTransitionRequest = BroadcastStateTransitionRequest.create({
        stateTransition: stateTransition.bytes()
    });
    await grpcPool.getClient().broadcastStateTransition(broadcastStateTransitionRequest);
}
