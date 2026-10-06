import { DashPlatformSDK } from './src/DashPlatformSDK.js'
import GRPCConnectionPool, { createClient } from './src/grpcConnectionPool.js'
import { decodeFetchError, decodeFetchErrorDetails, fetchWithDetails } from './src/utils/fetchWithDetails.js'

export type { GRPCOptions, GRPCPool } from './src/grpcConnectionPool.js'

export { DashPlatformSDK, GRPCConnectionPool, createClient, decodeFetchError, decodeFetchErrorDetails, fetchWithDetails }
