export default function indexValueBytesToString (value: Uint8Array<ArrayBufferLike>): string {
  const decoder = new TextDecoder()

  return decoder.decode(value).slice(2)
}
