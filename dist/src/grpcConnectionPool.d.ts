import { PlatformClient } from '../proto/generated/platform.client.js';
import { Network } from '../types.js';
export type MasternodeList = Record<string, MasternodeInfo>;
export interface GRPCOptions {
    poolLimit: 5;
    dapiUrl?: string | string[];
}
export interface MasternodeInfo {
    proTxHash: string;
    address: string;
    payee: string;
    status: string;
    type: string;
    platformNodeID: string;
    platformP2PPort: number;
    platformHTTPPort: number;
    pospenaltyscore: number;
    consecutivePayments: number;
    lastpaidtime: number;
    lastpaidblock: number;
    owneraddress: string;
    votingaddress: string;
    collateraladdress: string;
    pubkeyoperator: string;
}
export default class GRPCConnectionPool {
    dapiUrls: string[];
    network: Network;
    constructor(network: Network, grpcOptions?: GRPCOptions);
    _initialize(network: Network, poolLimit: number, dapiUrl?: string | string[]): Promise<void>;
    getClient(abortController?: AbortController): PlatformClient;
}
