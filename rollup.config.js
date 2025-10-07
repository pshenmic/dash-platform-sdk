import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default [
  {
    onwarn: function (warning, handler) {
      if (warning.code === 'THIS_IS_UNDEFINED' || (warning.loc.file.indexOf('@scure') !== -1 && warning.pluginCode === 'TS2345')) {
        return
      }

      handler(warning)
    },
    input: 'index.ts',
    output: {
      name: 'DashPlatformSDK',
      file: 'dist/bundle.js',
      format: 'umd'
    },
    plugins: [
      typescript({ module: 'ESNext' }),
      // babel(),
      resolve({
        'pshenmic-dpp': true
      }), // so Rollup can find `ms`
      terser({
        parse: {
          // parse options
        },
        compress: {
          // compress options
        },
        mangle: {
          // mangle options

          properties: {
            // mangle property options
          }
        },
        format: {
          // format options (can also use `output` for backwards compatibility)
        },
        ecma: 5, // specify one of: 5, 2015, 2016, etc.
        enclose: false, // or specify true, or "args:values"
        keep_classnames: false,
        keep_fnames: false,
        ie8: false,
        module: false,
        nameCache: null, // or specify a name cache object
        safari10: false,
        toplevel: false
      })
    ]
  }
]
