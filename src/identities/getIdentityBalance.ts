import { GetIdentityBalanceRequest } from '../../proto/generated/platform'
import { IdentifierWASM } from 'pshenmic-dpp'
import { IdentifierLike } from '../types'

export default async function getIdentityBalance (identifier: IdentifierLike): Promise<bigint> {
  const id = new IdentifierWASM(identifier)

  const getIdentityBalanceRequest = GetIdentityBalanceRequest.fromPartial({
    v0: {
      id: id.bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityBalance(getIdentityBalanceRequest)

  const { balance } = v0

  if (balance == null) {
    throw new Error(`Could not find balance for identity ${id.base58()}`)
  }

  return BigInt(balance)
}
