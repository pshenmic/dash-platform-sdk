export default function testNameContested (normalizedLabel: string): boolean {
  return /^[a-zA-Z01-]{3,19}$/.test(normalizedLabel)
}
