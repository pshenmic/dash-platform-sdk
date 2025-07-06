module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!pshenmic-dpp|wasm-drive-verify)"
  ],
  // At this moment tests runs in parallel processes with timeout 40 sec
  // If you need single run - uncomment line bellow
  // maxWorkers: 1,
  testTimeout: 40000
}
