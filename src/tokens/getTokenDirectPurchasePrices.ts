import GRPCConnectionPool from '../grpcConnectionPool'
import {IdentifierLike, TokenDirectPurchasePrices} from '../types'
import {IdentifierWASM, PlatformVersionWASM, verifyTokenDirectPurchasePrices} from "pshenmic-dpp";
import {
  GetTokenDirectPurchasePricesRequest,
  GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0
} from "../../proto/generated/platform";
import {getQuorumPublicKey} from "../utils/getQuorumPublicKey";
import verifyTenderdashProof from "../utils/verifyTenderdashProof";
import bytesToHex from "../utils/bytesToHex";

export default async function getTokenDirectPurchasePrices(grpcPool: GRPCConnectionPool, tokenIdentifiers: IdentifierLike[]): Promise<TokenDirectPurchasePrices[]> {
  const tokenIds = tokenIdentifiers.map(tokenId => new IdentifierWASM(tokenId).bytes())

  const request = GetTokenDirectPurchasePricesRequest.fromPartial({
    v0: {
      tokenIds,
      prove: true
    }
  })

  const {v0} = await grpcPool.getClient().getTokenDirectPurchasePrices(request)

  const {proof, metadata} = v0 as GetTokenDirectPurchasePricesResponse_GetTokenDirectPurchasePricesResponseV0;
  if (proof == null) {
    throw new Error('Proof not found')
  }

  if (metadata == null) {
    throw new Error('Metadata not found')
  }

  const {rootHash, prices} = verifyTokenDirectPurchasePrices(
    proof.grovedbProof,
    tokenIds,
    true,
    PlatformVersionWASM.PLATFORM_V9
  )

  if (prices == null) {
    throw new Error('Prices not found')
  }

  const quorumPublicKey = await getQuorumPublicKey(grpcPool.network, proof.quorumType, bytesToHex(proof.quorumHash))

  const verify = verifyTenderdashProof(proof, metadata, rootHash, quorumPublicKey)

  if (!verify) {
    throw new Error('Failed to verify query')
  }

  return prices
}
