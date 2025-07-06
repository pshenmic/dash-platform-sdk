export function bytesToHex(bytes: Uint8Array): string {
    return Array.prototype.map.call(bytes, (x: number) => ('00' + x.toString(16)).slice(-2)).join('')
}
