import { DocumentWASM, IdentifierLike, PlatformVersionLike } from 'pshenmic-dpp'

export default function createDocument (
  dataContractId: IdentifierLike,
  documentType: string,
  data: object,
  owner: IdentifierLike,
  identityContractNonce: bigint,
  revision?: bigint,
  documentId?: IdentifierLike,
  platformVersion?: PlatformVersionLike
): DocumentWASM {
  return new DocumentWASM(
    data,
    documentType,
    revision ?? BigInt(1),
    dataContractId,
    owner,
    documentId,
    owner,
    identityContractNonce,
    platformVersion
  )
}
