export default function getRandomBytes (length: number): Uint8Array {
  const array = Uint8Array.from({ length })

  return crypto.getRandomValues(array)
}
