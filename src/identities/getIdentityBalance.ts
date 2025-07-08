import {
  GetIdentityBalanceRequest,
  GetIdentityBalanceResponse_GetIdentityBalanceResponseV0
} from '../../proto/generated/platform'
import { IdentifierWASM, PlatformVersionWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'
import GRPCConnectionPool from '../grpcConnectionPool'
import { verifyIdentityBalanceForIdentityId } from 'wasm-drive-verify'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import bytesToHex from '../utils/bytesToHex'

export default async function getIdentityBalance (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<bigint> {
  const id = new IdentifierWASM(identifier)

  const getIdentityBalanceRequest = GetIdentityBalanceRequest.fromPartial({
    v0: {
      id: id.bytes(),
      prove: true
    }
  })

  const { v0 } = await grpcPool.getClient().getIdentityBalance(getIdentityBalanceRequest)

  const { proof, metadata } = v0 as GetIdentityBalanceResponse_GetIdentityBalanceResponseV0

  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {
    root_hash: rootHash,
    balance
  } = verifyIdentityBalanceForIdentityId(proof.grovedbProof, id.bytes(), true, PlatformVersionWASM.PLATFORM_V8)

  const quorumPublicKey = await getQuorumPublicKey(proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  if (balance == null) {
    throw new Error(`Failed to fetch balance for identifier ${id.base58()}`)
  }

  return BigInt(balance)
}
