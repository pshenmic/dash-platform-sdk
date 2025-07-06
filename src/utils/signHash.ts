import sha256 from "./sha256";

export default function signHash (quorumType: number, quorumHash: Uint8Array, requestId: Uint8Array, signBytesHash: Uint8Array) {
    const buf = Buffer.concat([
        Buffer.from([quorumType]),
        Buffer.from(quorumHash).reverse(),
        Buffer.from(requestId).reverse(),
        Buffer.from(signBytesHash).reverse()
    ])

    return sha256(sha256(buf)) as Uint8Array
}
