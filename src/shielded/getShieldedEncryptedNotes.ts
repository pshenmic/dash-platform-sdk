import { GRPCPool } from '../grpcConnectionPool.js'
import { GetShieldedEncryptedNotesRequest } from '../../proto/generated/platform.js'
import { ShieldedEncryptedNote } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedEncryptedNotesProof } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION, SHIELDED_MAX_NOTES_PER_QUERY} from "../constants.js";
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey.js";
import bytesToHex from "../utils/bytesToHex.js";
import verifyTenderdashProof from "../utils/verifyTenderdashProof.js";
import verifyGroveDBProof from '../utils/verifyGroveDBProof.js'
import withProofRetry from '../utils/withProofRetry.js'
import ProofError from '../utils/ProofError.js'

export default async function getShieldedEncryptedNotes (
  grpcPool: GRPCPool,
  startIndex: bigint,
  count: number,
  tokenIdentifier?: IdentifierLike
): Promise<ShieldedEncryptedNote[]> {
  const tokenId = tokenIdentifier != null ? new IdentifierWASM(tokenIdentifier) : undefined

  const getShieldedEncryptedNotesRequest = GetShieldedEncryptedNotesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startIndex: startIndex.toString(),
        count,
        prove: true,
        tokenId: tokenId?.bytes()
      }
    }
  })

  return await withProofRetry(grpcPool, async client => {
    const { response } = await client.getShieldedEncryptedNotes(getShieldedEncryptedNotesRequest)

    const { version } = response

    if (version.oneofKind !== 'v0') {
      throw new Error('Unexpected oneOf type returned from DAPI (must be v0)')
    }

    const { v0 } = version

    if (v0.result.oneofKind !== 'proof') {
      throw new Error('Unexpected oneOf type returned from DAPI (must be proof)')
    }

    const { result: { proof }, metadata } = v0

    if(metadata == null) {
      throw new Error('Metadata not found')
    }

    const {rootHash, notes} = verifyGroveDBProof(verifyShieldedEncryptedNotesProof, proof.grovedbProof, startIndex, count, SHIELDED_MAX_NOTES_PER_QUERY, true, LATEST_PLATFORM_VERSION, tokenId)

    const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

    const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

    if (!verify) {
      throw new ProofError('Failed to verify query')
    }

    return notes.map(note => ({
      nullifier: note.nullifier,
      cmx: note.cmx,
      encryptedNote: note.encryptedNote,
      cvNet: note.cvNet
    }))
  })
}
