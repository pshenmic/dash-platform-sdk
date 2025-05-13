import { GetIdentityBalanceRequest } from '../../proto/generated/platform'
import { IdentifierWASM } from 'pshenmic-dpp'
import {IdentifierLike} from "../index";

export default async function getBalance (identifier: IdentifierLike): Promise<bigint> {
  const getIdentityBalanceRequest = GetIdentityBalanceRequest.fromPartial({
    v0: {
      id: (new IdentifierWASM(identifier)).bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentityBalance(getIdentityBalanceRequest)

  const { balance } = v0

  if (balance == null) {
    throw new Error(`Could not find balance for identity ${(new IdentifierWASM(identifier)).bytes()}`)
  }

  return BigInt(balance)
}
