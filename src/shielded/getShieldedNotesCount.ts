import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedNotesCountRequest } from '../../proto/generated/platform.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedNotesCountProof } from 'pshenmic-dpp'
import {LATEST_PLATFORM_VERSION} from "../constants.js";
import {QuorumKeyProvider} from "../quorumKeyProvider.js";
import bytesToHex from "../utils/bytesToHex.js";
import verifyTenderdashProof from "../utils/verifyTenderdashProof.js";

export default async function getShieldedNotesCount (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
  tokenIdentifier?: IdentifierLike
): Promise<bigint | undefined> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedNotesCountRequest = GetShieldedNotesCountRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  const { response } = await (await grpcPool.getClient()).getShieldedNotesCount(getShieldedNotesCountRequest)

  const { version } = response

  if (version.oneofKind !== 'v0') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
  }

  const { v0 } = version

  if (v0.result.oneofKind !== 'proof') {
    throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
  }

  const { result: { proof }, metadata } = v0

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {rootHash, count} = verifyShieldedNotesCountProof(proof.grovedbProof, true, LATEST_PLATFORM_VERSION, tokenId)

  const quorumPublicKey = await quorumKeyProvider.getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return count
}
