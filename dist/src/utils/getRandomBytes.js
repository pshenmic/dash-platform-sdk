export default function getRandomBytes(length) {
    const array = Uint8Array.from({ length });
    return crypto.getRandomValues(array);
}
