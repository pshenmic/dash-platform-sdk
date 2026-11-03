import { PlatformVersionWASM, verifyEpochsInfoProof } from 'pshenmic-dpp'
import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetEpochsInfoRequest } from '../../proto/generated/platform.js'
import QueryExecutor, { getPoolProtocolVersion, getVerifiedProtocolVersion } from '../QueryExecutor.js'

/**
 * Returns the protocol version of the network learned from the verified responses.
 * If no response was verified yet, the current epoch is requested with proof (even if proofs are disabled),
 * so the protocol version is learned from its verified response
 */
export default async function getProtocolVersion (grpcPool: GRPCPool, quorumKeyProvider: QuorumKeyProvider): Promise<PlatformVersionWASM> {
  if (getVerifiedProtocolVersion(grpcPool) == null) {
    const getEpochsInfoRequest = GetEpochsInfoRequest.create({
      version: {
        oneofKind: 'v0',
        v0: {
          count: 1,
          ascending: false,
          prove: true
        }
      }
    })

    await QueryExecutor.build(grpcPool, quorumKeyProvider)
      .setGrpcRequest('getEpochsInfo', getEpochsInfoRequest)
      .setRequireProof(true)
      .setProofVerifier(verifyEpochsInfoProof, ({ metadata }, platformVersion) => [metadata.epoch, undefined, 1, false, platformVersion])
      .mapResponse(() => undefined)
      .execute()
  }

  return getPoolProtocolVersion(grpcPool)
}
