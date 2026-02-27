import { StateId } from '../../proto/generated/platform.js';
import sha256 from './sha256.js';
import { BinaryWriter } from '@bufbuild/protobuf/wire';
export async function calculateStateIdHash(stateId) {
    const writer = new BinaryWriter();
    // @ts-expect-error
    const encoded = StateId.internalBinaryWrite(stateId, writer, { writeUnknownFields: false }).finish();
    writer.bytes(encoded);
    return await sha256(writer.finish());
}
