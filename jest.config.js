export default {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(?:.pnpm/))(?!pshenmic-dpp|@protobuf-ts/grpcweb-transport|@scure*|@noble*|cbor2|@cto.af/wtf8|micro-packed)'
  ],
  // uncomment if don't need parallel tests
  // maxWorkers: 1,
  testEnvironment: 'node',
  testTimeout: 40000,
  extensionsToTreatAsEsm: ['.ts']
}
