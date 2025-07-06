import { StateId } from "../../proto/generated/platform";
import {BinaryWriter} from "@bufbuild/protobuf/wire";
import sha256 from "./sha256";

export function calculateStateIdHash (stateId: StateId) {
    const encoded = StateId.encode(stateId).finish()

    const writer = new BinaryWriter()

    writer.bytes(encoded)

    return sha256(writer.finish()) as Uint8Array
}
