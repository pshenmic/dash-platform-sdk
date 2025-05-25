import {HDKey, Versions} from "dashhd";
import * as DashHD from "dashhd";

export default async function keyToXPublicKey(hdkey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array>{
    return DashHD.toXPub(hdkey, opts);
}