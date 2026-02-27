export default function validateName(fullName) {
    const chunks = fullName.split('.');
    if (chunks.length !== 2) {
        return 'Name to search should be a full domain name (ex. pshenmic.dash)';
    }
    const [label, parentDomainName] = chunks;
    if (parentDomainName !== 'dash') {
        return 'Root domain must be .dash';
    }
    return /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/.test(label) ? null : 'Unacceptable label name';
}
