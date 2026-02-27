import { base58 } from '@scure/base';
export default function base58ToBytes(str) {
    return base58.decode(str);
}
