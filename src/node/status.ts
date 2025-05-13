/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  GetStatusRequest,
  GetStatusResponse,
  GetStatusResponse_GetStatusResponseV0
} from '../../proto/generated/platform'

export default async function status (): Promise<GetStatusResponse_GetStatusResponseV0 | undefined> {
  const getStatusRequest = GetStatusRequest.fromPartial({ v0: {} })

  const response: GetStatusResponse = await this.grpcPool.getClient().getStatus(getStatusRequest)

  const { v0 } = response

  // map buffers to hex string

  // todo catch nullable and define own interface

  // @ts-expect-error
  v0.node.id = v0.node.id.reduce((code, acc) => acc + code.toString(16), '')
  // @ts-expect-error
  v0.node.proTxHash = v0.node.proTxHash.reduce((code, acc) => acc + code.toString(16), '')
  // @ts-expect-error
  v0.chain.latestBlockHash = v0.chain.latestBlockHash.reduce((code, acc) => acc + code.toString(16), '')
  // @ts-expect-error
  v0.chain.latestAppHash = v0.chain.latestAppHash.reduce((code, acc) => acc + code.toString(16), '')
  // @ts-expect-error
  v0.chain.earliestAppHash = v0.chain.earliestAppHash.reduce((code, acc) => acc + code.toString(16), '')
  // @ts-expect-error
  v0.chain.earliestBlockHash = v0.chain.earliestBlockHash.reduce((code, acc) => acc + code.toString(16), '')

  return v0
}
