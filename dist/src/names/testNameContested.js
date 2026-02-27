export default function testNameContested(normalizedLabel) {
    return /^[a-zA-Z01-]{3,19}$/.test(normalizedLabel);
}
