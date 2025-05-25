import {HDKey, Versions} from "dashhd";
import * as DashHD from "dashhd";

export default async function keyToXPublicKeyBytes(hdkey: HDKey, opts?: { version: Versions | number }): Promise<Uint8Array>{
    return DashHD.toXPubBytes(hdkey, opts);
}