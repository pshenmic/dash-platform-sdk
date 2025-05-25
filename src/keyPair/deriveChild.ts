import {HDKey} from "dashhd";
import * as DashHD from "dashhd";

export default async function deriveChild(parent: HDKey, index: number, hardened: boolean): Promise<HDKey> {
    return DashHD.deriveChild(parent, index, hardened);
}