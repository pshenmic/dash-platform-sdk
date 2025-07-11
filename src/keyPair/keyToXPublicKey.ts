import { HDKey, Versions } from 'dashhd'
import * as DashHD from 'dashhd'
import {NetworkVersion} from "../types";

export default async function keyToXPublicKey (hdKey: HDKey, opts?: NetworkVersion): Promise<Uint8Array> {
  return await DashHD.toXPub(hdKey, opts)
}
