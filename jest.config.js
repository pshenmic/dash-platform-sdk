export default {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(?:.pnpm/))(?!pshenmic-dpp|@protobuf-ts/grpcweb-transport|@scure*|@noble*|cbor2|@cto.af/wtf8|micro-packed)'
  ],
  maxWorkers: 2,
  testEnvironment: 'node',
  testTimeout: 40000,
  extensionsToTreatAsEsm: ['.ts']
}
