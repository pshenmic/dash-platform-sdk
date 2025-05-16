export default function bytesToHex (bytes: ArrayLike<number>): string {
  return Array.prototype.map.call(bytes, (x: number) => ('00' + x.toString(16)).slice(-2)).join('')
}
