import { GetIdentityBalanceRequest } from '../../proto/generated/platform.js'
import { IdentifierWASM, verifyIdentityBalanceProof } from 'pshenmic-dpp'
import { IdentifierLike } from '../types.js'
import GRPCConnectionPool from '../grpcConnectionPool.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import bytesToHex from '../utils/bytesToHex.js'
import {LATEST_PLATFORM_VERSION} from "../constants.js";

export default async function getIdentityBalance (grpcPool: GRPCConnectionPool, identifier: IdentifierLike): Promise<bigint> {
  const id = new IdentifierWASM(identifier)

  const getIdentityBalanceRequest = GetIdentityBalanceRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        id: id.bytes(),
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getIdentityBalance(getIdentityBalanceRequest)

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

  const {
    rootHash,
    balance
  } = verifyIdentityBalanceProof(proof.grovedbProof, id.bytes(), true, LATEST_PLATFORM_VERSION)

  if (balance == null) {
    throw new Error(`Failed to fetch balance for identifier ${id.base58()}`)
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return BigInt(balance)
}
