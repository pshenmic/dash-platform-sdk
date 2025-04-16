export default function bytesToHex (bytes) {
  return Array.prototype.map.call(bytes, x => ('00' + x.toString(16)).slice(-2)).join('');
}
