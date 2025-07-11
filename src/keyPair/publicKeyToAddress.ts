import * as DashHD from 'dashhd'
import { NetworkVersion } from '../types'

export default async function publicKeyToAddress (publicKeyBytes: Uint8Array, opts?: NetworkVersion): Promise<string> {
  return await DashHD.toAddr(publicKeyBytes, opts)
}
