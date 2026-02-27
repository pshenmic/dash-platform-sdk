export default function derivePath(hdKey, path) {
    return hdKey.derive(path);
}
