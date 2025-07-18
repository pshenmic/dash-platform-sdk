import {
  GetIdentityKeysResponse_GetIdentityKeysResponseV0,
  GetIdentityKeysRequest,
  KeyRequestType
} from '../../proto/generated/platform'
import { IdentifierWASM, IdentityPublicKeyWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyIdentityKeysByIdentityId } from 'wasm-drive-verify'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'

export default async function getIdentityPublicKeys (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<IdentityPublicKeyWASM[]> {
  const id = new IdentifierWASM(identifier)
  const getIdentityKeysRequest = GetIdentityKeysRequest.fromPartial({
    v0: {
      identityId: id.bytes(),
      requestType: KeyRequestType.fromPartial({ allKeys: {} }),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityKeys(getIdentityKeysRequest)

  const { proof, metadata } = v0 as GetIdentityKeysResponse_GetIdentityKeysResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    loaded_identity_keys: loadedIdentityKeys
  } = verifyIdentityKeysByIdentityId(proof.grovedbProof, id.bytes(), null, false, false, true, null, null, PlatformVersionWASM.PLATFORM_V9)

  if (loadedIdentityKeys == null) {
    throw new Error(`Identity with identifier ${id.base58()} not found`)
  }

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return loadedIdentityKeys.map((loadedIdentityKey) => IdentityPublicKeyWASM.fromBytes(loadedIdentityKey))
}
