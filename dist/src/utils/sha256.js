import bytesToHex from './bytesToHex.js';
import { typedArrayToBuffer } from './bytesToTypedArray.js';
export default async function sha256(input) {
    if (typeof input === 'string') {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return bytesToHex(new Uint8Array(hash));
    }
    else {
        const arrayBuffer = typedArrayToBuffer(input);
        const hash = await crypto.subtle.digest('SHA-256', arrayBuffer);
        return new Uint8Array(hash);
    }
}
