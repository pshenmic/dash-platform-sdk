import convertToHomographSafeChars from './convertToHomographSafeChars'
import getEvonodeList from './getEvonodeList'
import { base58 } from '@scure/base'
import { MasternodeList } from '../types'
import getRandomArrayItem from "./getRandomArrayItem";
import hexToBytes from "./hexToBytes";

export class UtilsController {
  base58ToBytes (str: string): Uint8Array<ArrayBufferLike> {
    return base58.decode(str)
  }

  bytesToBase58 (bytes: Uint8Array): string {
    return base58.encode(bytes)
  }

  bytesToHex (bytes: Uint8Array): string {
    return Array.prototype.map.call(bytes, (x: number) => ('00' + x.toString(16)).slice(-2)).join('')
  }

  hexToBytes (hex: string): Uint8Array<ArrayBuffer> {
    return hexToBytes(hex)
  }

  convertToHomographSafeChars (str: string): string {
    return convertToHomographSafeChars(str)
  }

  async getEvonodeList (network: 'testnet' | 'mainnet'): Promise<MasternodeList> {
    return await getEvonodeList(network)
  }

  getRandomArrayItem (array: any[]): any {
    getRandomArrayItem(array)
  }
}
