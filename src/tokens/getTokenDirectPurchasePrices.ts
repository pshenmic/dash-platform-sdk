import GRPCConnectionPool from '../grpcConnectionPool'
import { IdentifierLike, TokenDirectPurchasePrices } from '../types'
import { IdentifierWASM, PlatformVersionWASM, verifyTokenDirectPurchasePrices } from 'pshenmic-dpp'
import { getQuorumPublicKey } from '../utils/getQuorumPublicKey'
import verifyTenderdashProof from '../utils/verifyTenderdashProof'
import bytesToHex from '../utils/bytesToHex'
import { GetTokenDirectPurchasePricesRequest } from '../../proto/generated/platform'

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
    PlatformVersionWASM.PLATFORM_V9
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
