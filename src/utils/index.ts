import convertToHomographSafeChars from "./convertToHomographSafeChars";
import getEvonodeList from "./getEvonodeList";
import {base58} from "@scure/base";

export class UtilsController {
    base58ToBytes(str: string) {
        return base58.decode(str)
    }
    bytesToBase58(bytes: Uint8Array) {
        return base58.encode(bytes)
    }
    bytesToHex(bytes: Uint8Array) {
        return Array.prototype.map.call(bytes, (x: number) => ('00' + x.toString(16)).slice(-2)).join('')
    }
    hexToBytes(hex: string) {
        return Uint8Array.from((hex.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)))
    }
    convertToHomographSafeChars(str: string) {
        return convertToHomographSafeChars(str)
    }
    getEvonodeList(network: 'testnet' | 'mainnet') {
        return getEvonodeList(network)
    }
    getRandomArrayItem(array: any[]) {
        return array[Math.floor((Math.random() * array.length))]
    }
}
