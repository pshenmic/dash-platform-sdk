export function typedArrayToBuffer(bytes) {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteLength + bytes.byteOffset);
}
