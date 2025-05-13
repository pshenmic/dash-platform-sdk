import { GetIdentityRequest } from '../../proto/generated/platform'
import parseIdentifier from '../utils/parseIdentifier'
import { IdentifierWASM, IdentityWASM } from 'pshenmic-dpp'
import {IdentifierLike} from "../index";

export default async function getByIdentifier (identifier: IdentifierLike): Promise<IdentityWASM> {
  const getIdentityRequest = GetIdentityRequest.fromPartial({
    v0: {
      id: (new IdentifierWASM(identifier)).bytes()
    }
  })

  const { v0 } = await this.grpcPool.getClient().getIdentity(getIdentityRequest)

  const { identity } = v0

  if (identity == null) {
    throw new Error(`Identity with identifier ${new IdentifierWASM(identifier).base58()} not found`)
  }

  return IdentityWASM.fromBytes(identity)
}
