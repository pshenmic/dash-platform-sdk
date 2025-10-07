export default {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(?:.pnpm/))(?!pshenmic-dpp|@protobuf-ts/grpcweb-transport|@scure*|@noble*|cbor-x|micro-packed)'
  ],
  // At this moment tests runs in parallel processes with timeout 40 sec
  // If you need single run - uncomment line bellow
  // maxWorkers: 1,
  testEnvironment: 'node',
  testTimeout: 40000,
  moduleNameMapper: {
    '^wasm-drive-verify$': ['<rootDir>/node_modules/wasm-drive-verify']
  }
}
