import { DashPlatformSDK } from './src/DashPlatformSDK.js'
import GRPCConnectionPool, { createClient } from './src/grpcConnectionPool.js'
import { decodeFetchError, decodeFetchErrorDetails, fetchWithDetails } from './src/utils/fetchWithDetails.js'
import { platformExplorerQuorumKeyProvider } from './src/utils/platformExplorerQuorumKeyProvider.js'
import {
  ProofVerificationError,
  QuorumKeyUnavailableError,
  ProofSignatureError,
  StaleResponseError,
  UnexpectedQuorumTypeError
} from './src/utils/proofVerificationErrors.js'

export type { GRPCOptions, GRPCPool } from './src/grpcConnectionPool.js'
export type {
  QuorumKeyRequest,
  QuorumKeyProvider,
  ProofVerificationOptions
} from './src/utils/verifyProofSignature.js'

export {
  DashPlatformSDK,
  GRPCConnectionPool,
  createClient,
  decodeFetchError,
  decodeFetchErrorDetails,
  fetchWithDetails,
  platformExplorerQuorumKeyProvider,
  ProofVerificationError,
  QuorumKeyUnavailableError,
  ProofSignatureError,
  StaleResponseError,
  UnexpectedQuorumTypeError
}
