import {HDKey} from "dashhd";
import * as DashHD from "dashhd";

export default async function derivePath(parent: HDKey, path: string): Promise<HDKey> {
    return DashHD.derivePath(parent, path)
}