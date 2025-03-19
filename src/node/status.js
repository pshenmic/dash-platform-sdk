import { GetStatusRequest } from '../../proto/generated/platform.js'

export default async function status() {
  const getStatusRequest = new GetStatusRequest.fromPartial({v0: {}});

  const response  = await this.client.getStatus(getStatusRequest)

  const {v0} = response

  // map buffers to hex string
  v0.node.id = v0.node.id.reduce((code, acc) => acc + code.toString(16), "")
  v0.node.proTxHash = v0.node.proTxHash.reduce((code, acc) => acc + code.toString(16), "")
  v0.chain.latestBlockHash = v0.chain.latestBlockHash.reduce((code, acc) => acc + code.toString(16), "")
  v0.chain.latestAppHash = v0.chain.latestAppHash.reduce((code, acc) => acc + code.toString(16), "")
  v0.chain.earliestAppHash = v0.chain.earliestAppHash.reduce((code, acc) => acc + code.toString(16), "")
  v0.chain.earliestBlockHash = v0.chain.earliestBlockHash.reduce((code, acc) => acc + code.toString(16), "")

  return v0
}
