import GRPCConnectionPool from '../grpcConnectionPool.js'
import { IdentifierLike, TokenDirectPurchasePrices } from '../types.js'
import { IdentifierWASM, verifyTokenDirectPurchasePrices } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey.js'
import verifyTenderdashProof from '../utils/verifyTenderdashProof.js'
import bytesToHex from '../utils/bytesToHex.js'
import { GetTokenDirectPurchasePricesRequest } from '../../proto/generated/platform.js'
import { LATEST_PLATFORM_VERSION } from '../constants.js'

export default async function getTokenDirectPurchasePrices (grpcPool: GRPCConnectionPool, tokenIdentifiers: IdentifierLike[]): Promise<TokenDirectPurchasePrices[]> {
  const tokenIds = tokenIdentifiers.map(tokenId => new IdentifierWASM(tokenId).bytes())

  const request = GetTokenDirectPurchasePricesRequest.create({
    version: {
      oneofKind: 'v0',
      v0: {
        tokenIds,
        prove: true
      }
    }
  })

  const { response } = await grpcPool.getClient().getTokenDirectPurchasePrices(request)

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

  const { rootHash, prices } = verifyTokenDirectPurchasePrices(
    proof.grovedbProof,
    tokenIds,
    true,
    LATEST_PLATFORM_VERSION
  )

  if (prices == null) {
    throw new Error('Prices not found')
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = await verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return prices
}
