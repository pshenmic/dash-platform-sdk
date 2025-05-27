import {
  DocumentCreateTransitionWASM,
  DocumentDeleteTransitionWASM, DocumentPurchaseTransitionWASM, DocumentReplaceTransitionWASM,
  DocumentsBatchWASM, DocumentTransferTransitionWASM,
  DocumentTransitionWASM, DocumentUpdatePriceTransitionWASM,
  DocumentWASM
} from "pshenmic-dpp";
import createTransition from "../transitions/createTransition";

export default async function create(input: DocumentWASM | DocumentTransitionWASM | DocumentCreateTransitionWASM | DocumentDeleteTransitionWASM | DocumentPurchaseTransitionWASM | DocumentReplaceTransitionWASM | DocumentTransferTransitionWASM | DocumentUpdatePriceTransitionWASM, opts?: {identityContractNonce: bigint, documentTypeName: string}): Promise<DocumentsBatchWASM> {
  let transition = input instanceof DocumentTransitionWASM ? input : undefined

  if (
    input instanceof DocumentCreateTransitionWASM ||
    input instanceof DocumentDeleteTransitionWASM ||
    input instanceof DocumentPurchaseTransitionWASM ||
    input instanceof DocumentReplaceTransitionWASM ||
    input instanceof DocumentTransferTransitionWASM ||
    input instanceof DocumentUpdatePriceTransitionWASM
  ) {
    transition = input.toDocumentTransition()
  } else if (input instanceof DocumentWASM) {

    if(opts?.identityContractNonce == null && opts?.documentTypeName == null) {
      throw new Error('You must specify a documentTypeName and identityContractNonce in opts if use DocumentWASM as input');
    }

    const createTx = await createTransition(input, opts?.identityContractNonce, opts?.documentTypeName)

    transition = createTx.toDocumentTransition()
  } else {
    throw new Error("Invalid input type")
  }

  return new this.wasm.DocumentsBatchWASM()
}