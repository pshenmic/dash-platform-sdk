import GRPCConnectionPool from '../grpcConnectionPool.js'
import { GetShieldedEncryptedNotesRequest } from '../../proto/generated/platform.js'
import { ShieldedEncryptedNote } from '../../types.js'
import {verifyShieldedEncryptedNotesProof} from "pshenmic-dpp";
import { LATEST_PLATFORM_VERSION, SHIELDED_MAX_NOTES_PER_QUERY} from "../constants.js";
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey.js";
import bytesToHex from "../utils/bytesToHex.js";
import verifyTenderdashProof from "../utils/verifyTenderdashProof.js";

export default async function getShieldedEncryptedNotes (
  grpcPool: GRPCConnectionPool,
  startIndex: bigint,
  count: number
): Promise<ShieldedEncryptedNote[]> {
  const getShieldedEncryptedNotesRequest = GetShieldedEncryptedNotesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        startIndex: startIndex.toString(),
        count,
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getShieldedEncryptedNotes(getShieldedEncryptedNotesRequest)

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

  const {rootHash, notes} = verifyShieldedEncryptedNotesProof(proof.grovedbProof, startIndex, count, SHIELDED_MAX_NOTES_PER_QUERY, true, LATEST_PLATFORM_VERSION)

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return notes.map(note => ({
    nullifier: note.nullifier,
    cmx: note.cmx,
    encryptedNote: note.encryptedNote,
    cvNet: note.cvNet
  }))
}
