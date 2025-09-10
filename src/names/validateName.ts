export default function validateName (fullName: string): string | null {
  const chunks = fullName.split('.')

  if (chunks.length !== 2) {
    return 'Name to search should be a full domain name (ex. pshenmic.dash)'
  }

  const [, parentDomainName] = chunks

  if (parentDomainName !== 'dash') {
    return 'Root domain must be .dash'
  }

  return null
}
