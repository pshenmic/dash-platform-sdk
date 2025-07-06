import sha256 from "./sha256";

export default function signRequestId (prefix: string, height: bigint, round: number): Uint8Array {
    const prefixBuf = Buffer.from(prefix, 'utf8')

    // len + i64 + i32
    const buf = Buffer.alloc(prefixBuf.length + 8 + 4)

    prefixBuf.copy(buf, 0)
    buf.writeBigInt64LE(height, prefixBuf.length)
    buf.writeInt32LE(round, prefixBuf.length + 8)

    return sha256(buf) as Uint8Array
}



