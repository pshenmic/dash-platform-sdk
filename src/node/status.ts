import { NodeStatus } from '../types'
import { GetStatusRequest, GetStatusResponse } from '../../proto/generated/platform'

export default async function status (): Promise<NodeStatus> {
  const getStatusRequest = GetStatusRequest.fromPartial({ v0: {} })

  const response: GetStatusResponse = await this.grpcPool.getClient().getStatus(getStatusRequest)

  const { v0 } = response

  // map buffers to hex string
  // todo catch nullable and define own interface
  v0.node.id = v0.node.id.reduce((code: number, acc: string) => acc + code.toString(16), '')
  v0.node.proTxHash = v0.node.proTxHash.reduce((code: number, acc: string) => acc + code.toString(16), '')
  v0.chain.latestBlockHash = v0.chain.latestBlockHash.reduce((code: number, acc: string) => acc + code.toString(16), '')
  v0.chain.latestAppHash = v0.chain.latestAppHash.reduce((code: number, acc: string) => acc + code.toString(16), '')
  v0.chain.earliestAppHash = v0.chain.earliestAppHash.reduce((code: number, acc: string) => acc + code.toString(16), '')
  v0.chain.earliestBlockHash = v0.chain.earliestBlockHash.reduce((code: number, acc: string) => acc + code.toString(16), '')

  return v0
}
