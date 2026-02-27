import { DashPlatformSDK } from '../../src/DashPlatformSDK.js';
let sdk;
describe('DashPlatformSDK', () => {
    beforeAll(() => {
        sdk = new DashPlatformSDK({ network: 'testnet' });
    });
    test('should be constructable throw `new`', () => {
        expect(sdk).toEqual(expect.any(DashPlatformSDK));
    });
});
