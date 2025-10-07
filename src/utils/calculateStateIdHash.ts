import { StateId } from '../../proto/generated/platform'
import sha256 from './sha256'
import { BinaryWriter } from '@bufbuild/protobuf/wire'

export async function calculateStateIdHash (stateId: StateId): Promise<Uint8Array> {
  const writer = new BinaryWriter()

  // @ts-expect-error
  const encoded = StateId.internalBinaryWrite(stateId, writer, { writeUnknownFields: false }).finish()

  writer.bytes(encoded)

  return await sha256(writer.finish()) as Uint8Array
}
