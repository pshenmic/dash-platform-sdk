export default function indexValueBytesToString(value) {
    const decoder = new TextDecoder();
    return decoder.decode(value).slice(2);
}
