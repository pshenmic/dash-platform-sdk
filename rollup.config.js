import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    onwarn: function (warning, handler) {
      // `worker_threads` is intentionally external (Node-only, guarded by isNode)
      if (warning.code === 'THIS_IS_UNDEFINED' ||
        warning.code === 'MISSING_NODE_BUILTINS' ||
        (warning?.loc?.file?.indexOf('@scure') !== -1 && warning.pluginCode === 'TS2345')) {
        return
      }

      handler(warning)
    },
    input: 'index.ts',
    // pshenmic-dpp's wasm loader references `worker_threads` behind an `isNode`
    // runtime guard; it's never reached in the browser, so keep it out of the
    // bundle instead of trying to shim a Node built-in.
    external: ['worker_threads'],
    output: {
      name: 'DashPlatformSDK',
      file: 'dist/bundle.min.js',
      format: 'umd',
      globals: {
        worker_threads: 'worker_threads'
      }
    },
    plugins: [
      alias({
        entries: [
          {
            find: 'pshenmic-dpp',
            replacement: path.resolve(
              'node_modules/pshenmic-dpp/dist/src/wasm.js'
            )
          }
        ]
      }),
      commonjs({
        transformMixedEsModules: true
      }),
      typescript({
        include: [
          './proto/generated/**/*',
          './index.ts',
          './src/**/*'
        ]
      }),
      // babel(),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      terser({
        // ecma 2020: the wasm glue uses BigInt/modern syntax; ES5 downleveling is unsafe
        ecma: 2020,
        compress: true,
        // property mangling MUST stay off: NAPI bindings, protobuf and cbor all
        // access properties by name, so renaming them corrupts the bundle
        mangle: { properties: false },
        // the SDK relies on WASM class identity (instanceof StateTransitionWASM, etc.)
        keep_classnames: true,
        keep_fnames: false,
        format: { comments: false }
      })
    ]
  }
]
