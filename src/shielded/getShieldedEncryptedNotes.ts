import { GRPCPool } from '../grpcConnectionPool.js'
import { QuorumKeyProvider } from '../quorumKeyProvider.js'
import { GetShieldedEncryptedNotesRequest } from '../../proto/generated/platform.js'
import { ShieldedEncryptedNote } from '../../types.js'
import { IdentifierLike, IdentifierWASM, verifyShieldedEncryptedNotesProof } from 'pshenmic-dpp'
import { LATEST_PLATFORM_VERSION, SHIELDED_MAX_NOTES_PER_QUERY } from '../constants.js'
import QueryExecutor from '../QueryExecutor.js'

export default async function getShieldedEncryptedNotes (
  grpcPool: GRPCPool,
  quorumKeyProvider: QuorumKeyProvider,
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

  return await QueryExecutor.build(grpcPool, quorumKeyProvider)
    .addGrpcRequest('getShieldedEncryptedNotes', getShieldedEncryptedNotesRequest)
    .addProofVerifier(verifyShieldedEncryptedNotesProof, startIndex, count, SHIELDED_MAX_NOTES_PER_QUERY, true, LATEST_PLATFORM_VERSION, tokenId)
    .addMapper(data => {
      const notes = data.proved ? data.verified.notes : data.result.encryptedNotes.entries

      return notes.map(note => ({
        nullifier: note.nullifier,
        cmx: note.cmx,
        encryptedNote: note.encryptedNote,
        cvNet: note.cvNet
      }))
    })
    .execute()
}
