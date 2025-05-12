import { GetIdentityBalanceRequest } from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'

export default async function getBalance (identifier) {
  const getIdentityBalanceRequest = GetIdentityBalanceRequest.fromPartial({
    v0: {
      id: parseIdentifier(identifier)
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityBalance(getIdentityBalanceRequest)

  const { balance } = v0

  if (!balance) {
    throw new Error(`Could not find balance for identity ${identifier}`)
  }

  return BigInt(balance)
}
