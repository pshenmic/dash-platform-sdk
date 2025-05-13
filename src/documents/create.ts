import { DataContractWASM, DocumentWASM } from 'pshenmic-dpp'
import {IdentifierLike} from "../index";

/**
 * Creates a document
 * @param dataContract {DataContractWASM}
 * @param documentType {string}
 * @param data {object}
 * @param identityContractNonce {bigint}
 * @param owner {IdentifierLike}
 */
export default async function createDocument (
  dataContract: DataContractWASM,
  documentType: string,
  data: object,
  identityContractNonce: bigint,
  owner: IdentifierLike): Promise<DocumentWASM> {
  return new this.wasm.DocumentWASM(
    data,
    documentType,
    identityContractNonce,
    dataContract,
    owner
  )
}
