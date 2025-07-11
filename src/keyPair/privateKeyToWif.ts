import * as DashHD from 'dashhd'
import { NetworkVersion } from '../types'

export default async function privateKeyToWif (privateKeyBytes: Uint8Array, opts?: NetworkVersion): Promise<string> {
  return await DashHD.toWif(privateKeyBytes, opts)
}
